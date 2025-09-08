import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';

export async function POST() {
  try {
    // Create user_db table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_db (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        company VARCHAR(100),
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        mobile VARCHAR(20),
        email VARCHAR(100) NOT NULL,
        address1 VARCHAR(255) NOT NULL,
        address2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        postcode VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        state VARCHAR(100),
        type VARCHAR(20) DEFAULT 'retail',
        customer_group INT DEFAULT 3,
        customer_reference VARCHAR(100),
        special_customer VARCHAR(10) DEFAULT 'no',
        active TINYINT(1) DEFAULT 1,
        deleted TINYINT(1) DEFAULT 0,
        joining_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await user_db.promise().query(createTableQuery);
    console.log('✅ user_db table created successfully');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_email ON user_db(email)',
      'CREATE INDEX IF NOT EXISTS idx_username ON user_db(username)',
      'CREATE INDEX IF NOT EXISTS idx_status ON user_db(active, deleted)'
    ];

    for (const indexQuery of indexes) {
      try {
        await user_db.promise().query(indexQuery);
        console.log('✅ Index created successfully');
      } catch (indexError) {
        console.log('ℹ️ Index might already exist:', indexError.message);
      }
    }

    // Verify table creation
    const [tables] = await user_db.promise().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'u874817156_nexpress_user' 
      AND TABLE_NAME = 'user_db'
    `);

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      tableCreated: tables.length > 0,
      data: {
        table: 'user_db',
        status: 'created',
        indexes: 'created'
      }
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database setup failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
