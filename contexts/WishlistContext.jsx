"use client";
import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const WishlistContext = createContext();

const WISHLIST_ACTIONS = {
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST'
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST:
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Already in wishlist
      }
      return [...state, action.payload];
    
    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
      return state.filter(item => item.id !== action.payload);
    
    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return [];
    
    case WISHLIST_ACTIONS.LOAD_WISHLIST:
      return action.payload || [];
    
    default:
      return state;
  }
};

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(wishlistReducer, []);
  const [loadedFromServer, setLoadedFromServer] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage and sync to server if logged-in
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ items: wishlist })
      }).catch(() => {});
    }
  }, [wishlist]);

  // On login load server wishlist and merge with local
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;
    if (loadedFromServer) return;
    (async () => {
      try {
        const res = await fetch('/api/wishlist', { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const server = Array.isArray(data.items) ? data.items : [];
        const local = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const byId = new Map();
        [...server, ...local].forEach(p => { byId.set(p.id, p); });
        const merged = Array.from(byId.values());
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: merged });
        setLoadedFromServer(true);
      } catch {}
    })();
  }, [loadedFromServer]);

  const addToWishlist = (product) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD_TO_WISHLIST, payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST, payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
