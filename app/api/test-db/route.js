import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const [result] = await user_db.promise().query('SELECT 1 as test');
    
    // Check if user_db table exists
    const [tables] = await user_db.promise().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'u874817156_nexpress_user' 
      AND TABLE_NAME = 'user_db'
    `);
    
    // Get table structure
    const [columns] = await user_db.promise().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'u874817156_nexpress_user' 
      AND TABLE_NAME = 'user_db'
      ORDER BY ORDINAL_POSITION
    `);
    
    // Count existing users
    const [userCount] = await user_db.promise().query('SELECT COUNT(*) as count FROM user_db WHERE deleted = 0');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'OK',
        tableExists: tables.length > 0,
        tableStructure: columns,
        userCount: userCount[0].count
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
