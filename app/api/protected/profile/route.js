import { NextResponse } from 'next/server';
import { requireAuth, logRequest } from '@/lib/middleware';
import { user_db } from '@/lib/db';

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

    // Get user profile from database
    const [users] = await user_db.promise().query(`
      SELECT id, username, first_name, last_name, email, company, 
             telephone, mobile, address1, address2, city, postcode, 
             country, state, type, customer_group, joining_date
      FROM user_db 
      WHERE id = ? AND deleted = 0
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
        username: userProfile.username,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        email: userProfile.email,
        company: userProfile.company,
        telephone: userProfile.telephone,
        mobile: userProfile.mobile,
        address: {
          address1: userProfile.address1,
          address2: userProfile.address2,
          city: userProfile.city,
          postcode: userProfile.postcode,
          country: userProfile.country,
          state: userProfile.state
        },
        type: userProfile.type,
        customerGroup: userProfile.customer_group,
        joiningDate: userProfile.joining_date
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

    // Update user profile
    const { firstName, lastName, company, telephone, mobile, address1, address2, city, postcode, country, state } = body;

    await user_db.promise().query(`
      UPDATE user_db 
      SET first_name = ?, last_name = ?, company = ?, telephone = ?, mobile = ?,
          address1 = ?, address2 = ?, city = ?, postcode = ?, country = ?, state = ?,
          updated_at = NOW()
      WHERE id = ? AND deleted = 0
    `, [firstName, lastName, company, telephone, mobile, address1, address2, city, postcode, country, state, user.userId]);

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
