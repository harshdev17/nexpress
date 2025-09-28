import { NextResponse } from 'next/server';
import { requireAuth, logRequest } from '@/lib/middleware';
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

    const user = authResult.user;

    // Log the request
    logRequest(request, null, user);

    // Get user profile from customers table
    const [users] = await old_db.promise().query(`
      SELECT id, Username, Forename, Surname, Email, Company, 
             Tel, MobileTel, UserType, CustomerGroupID, CreatedDateTime,
             CustomerReference, FileAsName, Fax, TaxReference, TaxStatus,
             IsSpecialCustomer, DefaultDeliveryAddressID, DefaultBillingAddressID,
             Active, Notes
      FROM customers 
      WHERE id = ? AND Deleted = 0
    `, [user.userId]);

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userProfile = users[0];

    return NextResponse.json({
      success: true,
      message: 'Profile retrieved successfully',
      profile: {
        id: userProfile.id,
        username: userProfile.Username,
        firstName: userProfile.Forename,
        lastName: userProfile.Surname,
        email: userProfile.Email,
        company: userProfile.Company,
        telephone: userProfile.Tel,
        mobile: userProfile.MobileTel,
        fax: userProfile.Fax,
        type: userProfile.UserType,
        customerGroup: userProfile.CustomerGroupID,
        customerReference: userProfile.CustomerReference,
        fileAsName: userProfile.FileAsName,
        taxReference: userProfile.TaxReference,
        taxStatus: userProfile.TaxStatus,
        isSpecialCustomer: userProfile.IsSpecialCustomer,
        defaultDeliveryAddressID: userProfile.DefaultDeliveryAddressID,
        defaultBillingAddressID: userProfile.DefaultBillingAddressID,
        active: userProfile.Active,
        notes: userProfile.Notes,
        joiningDate: userProfile.CreatedDateTime
      }
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve profile' },
      { status: 500 }
    );
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

    const user = authResult.user;
    const body = await request.json();
    
    // Log the request
    logRequest(request, null, user);

    // Update user profile in customers table
    const { 
      firstName, lastName, company, telephone, mobile, fax, 
      customerReference, fileAsName, taxReference, taxStatus, notes 
    } = body;

    await old_db.promise().query(`
      UPDATE customers 
      SET Forename = ?, Surname = ?, Company = ?, Tel = ?, MobileTel = ?,
          Fax = ?, CustomerReference = ?, FileAsName = ?, TaxReference = ?, 
          TaxStatus = ?, Notes = ?, ModifiedDateTime = NOW()
      WHERE id = ? AND Deleted = 0
    `, [
      firstName, lastName, company, telephone, mobile, fax,
      customerReference, fileAsName, taxReference, taxStatus, notes,
      user.userId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
