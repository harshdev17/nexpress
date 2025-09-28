import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { old_db } from '@/lib/db';

export async function GET(request) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.user.userId;

    // Fetch addresses from old database
    const [addresses] = await old_db.promise().query(`
      SELECT 
        ca.id,
        ca.AddressType,
        ca.Company,
        ca.Forename,
        ca.Surname,
        ca.Address1,
        ca.Address2,
        ca.City,
        ca.Postcode,
        ca.CountryName,
        ca.State,
        ca.Tel
      FROM customer_addresses ca
      WHERE ca.CustomerId = ? AND ca.Deleted = 0
      ORDER BY ca.id DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      addresses: addresses.map(addr => ({
        id: addr.id,
        type: addr.AddressType || 'Delivery',
        isDefault: false, // This column doesn't exist in the schema
        name: `${addr.Forename || ''} ${addr.Surname || ''}`.trim() || '',
        company: addr.Company || 'Personal',
        address1: addr.Address1 || '',
        address2: addr.Address2 || '',
        city: addr.City || '',
        postcode: addr.Postcode || '',
        country: addr.CountryName || 'United Kingdom',
        state: addr.State || '',
        phone: addr.Tel || '',
        mobile: '', // MobileTel column doesn't exist in customer_addresses table
        email: '' // Email field doesn't exist in customer_addresses table
      }))
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch addresses',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.user.userId;
    const body = await request.json();

    const {
      type,
      isDefault,
      name,
      company,
      address1,
      address2,
      city,
      postcode,
      country,
      state,
      phone
    } = body;

    // Note: IsDefault column doesn't exist in schema, so we skip this logic

    // Insert new address
    const [result] = await old_db.promise().query(`
      INSERT INTO customer_addresses (
        CustomerId, AddressType, Company, Forename, Surname,
        Address1, Address2, City, Postcode, CountryName, State,
        Tel, Deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      userId, type, company, name.split(' ')[0] || '', name.split(' ').slice(1).join(' ') || '',
      address1, address2, city, postcode, country, state,
      phone
    ]);

    return NextResponse.json({
      success: true,
      addressId: result.insertId
    });

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create address',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.user.userId;
    const body = await request.json();
    const { addressId, ...updateData } = body;

    // Note: IsDefault column doesn't exist in schema, so we skip this logic

    // Update address
    await old_db.promise().query(`
      UPDATE customer_addresses SET
        AddressType = ?, Company = ?, Forename = ?, Surname = ?,
        Address1 = ?, Address2 = ?, City = ?, Postcode = ?, 
        CountryName = ?, State = ?, Tel = ?
      WHERE id = ? AND CustomerId = ? AND Deleted = 0
    `, [
      updateData.type, updateData.company, 
      updateData.name.split(' ')[0] || '', updateData.name.split(' ').slice(1).join(' ') || '',
      updateData.address1, updateData.address2, updateData.city, updateData.postcode,
      updateData.country, updateData.state, updateData.phone,
      addressId, userId
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update address',
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.user.userId;
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    if (!addressId) {
      return NextResponse.json({ success: false, error: 'Address ID required' }, { status: 400 });
    }

    // Soft delete address
    await old_db.promise().query(`
      UPDATE customer_addresses 
      SET Deleted = 1
      WHERE id = ? AND CustomerId = ? AND Deleted = 0
    `, [addressId, userId]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete address',
      details: error.message 
    }, { status: 500 });
  }
}
