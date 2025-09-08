import { NextResponse } from 'next/server';
import { user_db } from '@/lib/db';

export async function POST() {
  try {
    // Create user_sessions table
    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(500) UNIQUE NOT NULL,
        refresh_token VARCHAR(500) UNIQUE,
        
        -- Device and Browser Information
        user_agent TEXT,
        device_type VARCHAR(50),
        browser_name VARCHAR(100),
        browser_version VARCHAR(50),
        os_name VARCHAR(100),
        os_version VARCHAR(50),
        
        -- Network and Location Information
        ip_address VARCHAR(45) NOT NULL,
        country VARCHAR(100),
        city VARCHAR(100),
        region VARCHAR(100),
        timezone VARCHAR(100),
        isp VARCHAR(200),
        
        -- Security Information
        is_secure_connection BOOLEAN DEFAULT FALSE,
        is_vpn BOOLEAN DEFAULT FALSE,
        is_proxy BOOLEAN DEFAULT FALSE,
        risk_score INT DEFAULT 0,
        
        -- Session Management
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        logout_time TIMESTAMP NULL,
        logout_reason VARCHAR(100),
        
        -- Additional Security
        failed_attempts INT DEFAULT 0,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_verified BOOLEAN DEFAULT FALSE,
        
        -- Analytics Data
        login_source VARCHAR(100),
        referrer_url TEXT,
        landing_page TEXT,
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Foreign Key
        FOREIGN KEY (user_id) REFERENCES user_db(id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_user_id (user_id),
        INDEX idx_session_token (session_token),
        INDEX idx_ip_address (ip_address),
        INDEX idx_login_time (login_time),
        INDEX idx_is_active (is_active),
        INDEX idx_expires_at (expires_at),
        INDEX idx_user_active (user_id, is_active)
      )
    `;

    await user_db.promise().query(createSessionsTable);
    console.log('✅ user_sessions table created successfully');

    // Create login_analytics table
    const createAnalyticsTable = `
      CREATE TABLE IF NOT EXISTS login_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        session_id INT,
        
        -- Login Statistics
        login_date DATE NOT NULL,
        login_hour INT NOT NULL,
        login_day_of_week INT NOT NULL,
        
        -- Device Analytics
        device_type VARCHAR(50),
        browser_name VARCHAR(100),
        os_name VARCHAR(100),
        
        -- Location Analytics
        country VARCHAR(100),
        city VARCHAR(100),
        region VARCHAR(100),
        
        -- Security Analytics
        ip_address VARCHAR(45),
        is_new_device BOOLEAN DEFAULT FALSE,
        is_new_location BOOLEAN DEFAULT FALSE,
        risk_level VARCHAR(20) DEFAULT 'low',
        
        -- Session Analytics
        session_duration INT DEFAULT 0,
        page_views INT DEFAULT 0,
        actions_performed INT DEFAULT 0,
        
        -- Performance Metrics
        login_success BOOLEAN DEFAULT TRUE,
        login_time_ms INT DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Foreign Keys
        FOREIGN KEY (user_id) REFERENCES user_db(id) ON DELETE CASCADE,
        FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_user_date (user_id, login_date),
        INDEX idx_login_date (login_date),
        INDEX idx_device_type (device_type),
        INDEX idx_country (country),
        INDEX idx_risk_level (risk_level)
      )
    `;

    await user_db.promise().query(createAnalyticsTable);
    console.log('✅ login_analytics table created successfully');

    // Create security_events table
    const createSecurityTable = `
      CREATE TABLE IF NOT EXISTS security_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        session_id INT,
        
        -- Event Details
        event_type VARCHAR(100) NOT NULL,
        event_severity VARCHAR(20) NOT NULL,
        event_description TEXT,
        
        -- Technical Details
        ip_address VARCHAR(45),
        user_agent TEXT,
        request_headers JSON,
        
        -- Security Context
        risk_score INT DEFAULT 0,
        blocked BOOLEAN DEFAULT FALSE,
        action_taken VARCHAR(200),
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Foreign Keys
        FOREIGN KEY (user_id) REFERENCES user_db(id) ON DELETE SET NULL,
        FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE SET NULL,
        
        -- Indexes
        INDEX idx_user_id (user_id),
        INDEX idx_event_type (event_type),
        INDEX idx_severity (event_severity),
        INDEX idx_created_at (created_at),
        INDEX idx_ip_address (ip_address)
      )
    `;

    await user_db.promise().query(createSecurityTable);
    console.log('✅ security_events table created successfully');

    // Verify all tables exist
    const [tables] = await user_db.promise().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'u874817156_nexpress_user' 
      AND TABLE_NAME IN ('user_sessions', 'login_analytics', 'security_events')
    `);

    return NextResponse.json({
      success: true,
      message: 'Session management tables created successfully',
      tablesCreated: tables.length,
      tables: tables.map(t => t.TABLE_NAME)
    });

  } catch (error) {
    console.error('Session setup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Session setup failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
