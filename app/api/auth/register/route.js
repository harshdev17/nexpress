import { NextResponse } from 'next/server';
import { old_db } from '@/lib/db';

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

    // Check if email already exists in customers table
    const [existingUsers] = await old_db.promise().query(
      'SELECT id, Username, Email, Active, Deleted FROM customers WHERE Email = ?',
      [email.toLowerCase().trim()]
    );

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      
      if (existingUser.Deleted === 1) {
        console.log(`Registration failed - email previously deleted: ${email}`);
        return NextResponse.json(
          { success: false, error: 'This email was previously registered but the account has been deleted. Please contact support to reactivate.' },
          { status: 400 }
        );
      }
      
      if (existingUser.Active === 0) {
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
      const [existingUsernames] = await old_db.promise().query(
        'SELECT id FROM customers WHERE Username = ? AND Deleted = 0',
        [username]
      );

      if (existingUsernames.length === 0) {
        break;
      }
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Generate CustomerReference
    const customerReference = `CUST${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Insert new user into customers table (password in plain text for old DB)
    const [result] = await old_db.promise().query(`
      INSERT INTO customers (
        CreatedDateTime,
        ModifiedDateTime,
        CustomerGroupID,
        SalesAgentAdminUserID,
        CustomerReference,
        Username,
        Password,
        Forename,
        Surname,
        Company,
        FileAsName,
        Email,
        Tel,
        MobileTel,
        Fax,
        UserType,
        BillingAddressSame,
        HowDidYouHear,
        TaxReference,
        TaxStatus,
        IsSpecialCustomer,
        DefaultDeliveryAddressID,
        DefaultBillingAddressID,
        Active,
        Notes,
        Deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      new Date(), // CreatedDateTime
      new Date(), // ModifiedDateTime
      3, // CustomerGroupID
      0, // SalesAgentAdminUserID
      customerReference, // CustomerReference
      username,
      password, // Store plain text password for old DB
      firstName.trim(),
      lastName.trim(),
      company || '',
      `${firstName} ${lastName}`, // FileAsName
      email.toLowerCase().trim(),
      telephone.trim(),
      mobile ? mobile.trim() : '',
      '', // Fax
      'Standard', // UserType
      0, // BillingAddressSame
      '', // HowDidYouHear
      '', // TaxReference
      'Taxable', // TaxStatus
      0, // IsSpecialCustomer
      0, // DefaultDeliveryAddressID
      0, // DefaultBillingAddressID
      1, // Active
      '', // Notes
      0 // Deleted
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
