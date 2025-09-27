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
        ca.Nickname,
        ca.Forename,
        ca.Surname,
        ca.Company,
        ca.Address1,
        ca.Address2,
        ca.City,
        ca.Postcode,
        ca.CountryName,
        ca.State,
        ca.Tel,
        ca.Email
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
        email: addr.Email || '',
        nickname: addr.Nickname || ''
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
      phone,
      email
    } = body;

    // If setting as default, unset other defaults first
    if (isDefault) {
      await old_db.promise().query(`
        UPDATE customer_addresses 
        SET IsDefault = 0 
        WHERE CustomerID = ? AND Deleted = 0
      `, [userId]);
    }

    // Insert new address
    const [result] = await old_db.promise().query(`
      INSERT INTO customer_addresses (
        CustomerID, AddressType, IsDefault, ContactName, CompanyName,
        AddressLine1, AddressLine2, City, Postcode, Country, State,
        PhoneNumber, Email, CreatedDateTime, ModifiedDateTime, Deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)
    `, [
      userId, type, isDefault ? 1 : 0, name, company,
      address1, address2, city, postcode, country, state,
      phone, email
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

    // If setting as default, unset other defaults first
    if (updateData.isDefault) {
      await old_db.promise().query(`
        UPDATE customer_addresses 
        SET IsDefault = 0 
        WHERE CustomerID = ? AND Deleted = 0 AND id != ?
      `, [userId, addressId]);
    }

    // Update address
    await old_db.promise().query(`
      UPDATE customer_addresses SET
        AddressType = ?, IsDefault = ?, ContactName = ?, CompanyName = ?,
        AddressLine1 = ?, AddressLine2 = ?, City = ?, Postcode = ?, 
        Country = ?, State = ?, PhoneNumber = ?, Email = ?, ModifiedDateTime = NOW()
      WHERE id = ? AND CustomerID = ? AND Deleted = 0
    `, [
      updateData.type, updateData.isDefault ? 1 : 0, updateData.name, updateData.company,
      updateData.address1, updateData.address2, updateData.city, updateData.postcode,
      updateData.country, updateData.state, updateData.phone, updateData.email,
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
      SET Deleted = 1, ModifiedDateTime = NOW()
      WHERE id = ? AND CustomerID = ? AND Deleted = 0
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
