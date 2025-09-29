"use client";
import { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      };
    
    default:
      return state;
  }
};

// Cart Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });
  const [loadedFromServer, setLoadedFromServer] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nexpress-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage and sync to server when logged-in
  useEffect(() => {
    localStorage.setItem('nexpress-cart', JSON.stringify(state.items));
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ items: state.items })
      }).catch(() => {});
    }
  }, [state.items]);

  // On login: fetch server cart and prompt merge if local has items
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;
    if (loadedFromServer) return;
    (async () => {
      try {
        const res = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const serverItems = Array.isArray(data.items) ? data.items : [];
        const localItems = JSON.parse(localStorage.getItem('nexpress-cart') || '[]');
        // Simple merge: combine and sum quantities by id
        const map = new Map();
        [...serverItems, ...localItems].forEach(it => {
          const prev = map.get(it.id);
          if (prev) map.set(it.id, { ...prev, quantity: prev.quantity + (it.quantity || 1) });
          else map.set(it.id, { ...it, quantity: it.quantity || 1 });
        });
        const merged = Array.from(map.values());
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: merged });
        setLoadedFromServer(true);
      } catch {}
    })();
  }, [loadedFromServer]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: {
        id: product.id,
        name: product.ItemName,
        price: product.ItemPrice,
        salePrice: product.ItemSalePrice || product.salePrice,
        isOnSale: product.ItemIsOnSale || product.isOnSale,
        image: product.ItemMainImage,
        brand: product.Brand,
        quantity: quantity
      }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: productId
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Calculate totals
  const getCartTotals = () => {
    const subtotal = state.items.reduce((total, item) => {
      const price = item.isOnSale && item.salePrice > 0 ? item.salePrice : item.price;
      return total + (price * item.quantity);
    }, 0);
    
    const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
    
    // Only apply VAT and shipping if there are items in the cart
    if (itemCount === 0) {
      return {
        subtotal: 0,
        vat: 0,
        shipping: 0,
        total: 0,
        itemCount: 0
      };
    }
    
    const vat = subtotal * 0.2; // 20% VAT
    const shipping = subtotal >= 40 ? 0 : 3.33; // Free shipping over £40
    const total = subtotal + vat + shipping;
    
    return {
      subtotal: subtotal,
      vat: vat,
      shipping: shipping,
      total: total,
      itemCount: itemCount
    };
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
