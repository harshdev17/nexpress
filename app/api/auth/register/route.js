import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company,
      firstName,
      lastName,
      telephone,
      mobile,
      email,
      address1,
      address2,
      city,
      postcode,
      country,
      state,
      password,
      confirmPassword
    } = body;

    console.log(`Registration attempt for email: ${email}`);

    // Enhanced Validation
    if (!firstName || !lastName || !telephone || !email || !address1 || !city || !postcode || !country || !password) {
      console.log(`Registration failed - missing required fields for email: ${email}`);
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      console.log(`Registration failed - password mismatch for email: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log(`Registration failed - password too short for email: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`Registration failed - invalid email format: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists - Enhanced checking
    const [existingUsers] = await user_db.promise().query(
      'SELECT id, username, email, active, deleted FROM user_db WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      
      if (existingUser.deleted === 1) {
        console.log(`Registration failed - email previously deleted: ${email}`);
        return NextResponse.json(
          { success: false, error: 'This email was previously registered but the account has been deleted. Please contact support to reactivate.' },
          { status: 400 }
        );
      }
      
      if (existingUser.active === 0) {
        console.log(`Registration failed - email account deactivated: ${email}`);
        return NextResponse.json(
          { success: false, error: 'This email is already registered but the account is deactivated. Please contact support to reactivate your account.' },
          { status: 400 }
        );
      }
      
      console.log(`Registration failed - email already registered: ${email}`);
      return NextResponse.json(
        { success: false, error: 'This email address is already registered. Please use a different email or try logging in instead.' },
        { status: 400 }
      );
    }

    // Generate unique username from email
    const baseUsername = email.split('@')[0];
    let username = baseUsername;
    let counter = 1;

    // Check if username exists and generate unique one
    while (true) {
      const [existingUsernames] = await user_db.promise().query(
        'SELECT id FROM user_db WHERE username = ? AND deleted = 0',
        [username]
      );

      if (existingUsernames.length === 0) {
        break;
      }
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Hash password with higher security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user with all required fields
    const [result] = await user_db.promise().query(`
      INSERT INTO user_db (
        username,
        password,
        company,
        first_name,
        last_name,
        telephone,
        mobile,
        email,
        address1,
        address2,
        city,
        postcode,
        country,
        state,
        type,
        customer_group,
        customer_reference,
        special_customer,
        active,
        deleted,
        joining_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      username,
      hashedPassword,
      company || null,
      firstName.trim(),
      lastName.trim(),
      telephone.trim(),
      mobile ? mobile.trim() : null,
      email.toLowerCase().trim(),
      address1.trim(),
      address2 ? address2.trim() : null,
      city.trim(),
      postcode.trim(),
      country.trim(),
      state ? state.trim() : null,
      'retail', // Fixed value as requested
      3, // Fixed value as requested
      null, // customer_reference - null as requested
      'no', // special_customer - 'no' as requested
      1, // active
      0, // deleted
      new Date() // joining_date
    ]);

    console.log(`New user registered: ${username} (ID: ${result.insertId})`);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: result.insertId,
      username: username,
      userDetails: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        type: 'retail',
        customerGroup: 3,
        joiningDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
