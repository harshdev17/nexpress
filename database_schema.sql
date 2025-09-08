-- Consolidated database schema additions for auth features

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token VARCHAR(128) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- NEXPRESS DELIVERY - ENHANCED LOGIN SYSTEM SCHEMA
-- =====================================================
-- This file contains the database schema for the enhanced login system
-- Run this script in the u874817156_nexpress_user database
-- =====================================================

-- =====================================================
-- 1. USER_SESSIONS TABLE
-- =====================================================
-- Stores active login sessions with comprehensive tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    
    -- Device and Browser Information
    user_agent TEXT,
    device_type VARCHAR(50), -- mobile, tablet, desktop
    browser_name VARCHAR(100),
    browser_version VARCHAR(50),
    os_name VARCHAR(100),
    os_version VARCHAR(50),
    
    -- Network and Location Information
    ip_address VARCHAR(45) NOT NULL, -- IPv4 or IPv6
    country VARCHAR(100),
    city VARCHAR(100),
    region VARCHAR(100),
    timezone VARCHAR(100),
    isp VARCHAR(200),
    
    -- Security Information
    is_secure_connection BOOLEAN DEFAULT FALSE,
    is_vpn BOOLEAN DEFAULT FALSE,
    is_proxy BOOLEAN DEFAULT FALSE,
    risk_score INT DEFAULT 0, -- 0-100 risk assessment
    
    -- Session Management
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    logout_time TIMESTAMP NULL,
    logout_reason VARCHAR(100), -- user_logout, timeout, security, admin
    
    -- Additional Security
    failed_attempts INT DEFAULT 0,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_verified BOOLEAN DEFAULT FALSE,
    
    -- Analytics Data
    login_source VARCHAR(100), -- direct, referral, social, email
    referrer_url TEXT,
    landing_page TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES user_db(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_ip_address (ip_address),
    INDEX idx_login_time (login_time),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at),
    INDEX idx_user_active (user_id, is_active)
);

-- =====================================================
-- 2. LOGIN_ANALYTICS TABLE
-- =====================================================
-- Stores comprehensive login analytics and insights
CREATE TABLE IF NOT EXISTS login_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id INT,
    
    -- Login Statistics
    login_date DATE NOT NULL,
    login_hour INT NOT NULL, -- 0-23
    login_day_of_week INT NOT NULL, -- 0-6 (Sunday=0)
    
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
    risk_level VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
    
    -- Session Analytics
    session_duration INT DEFAULT 0, -- in minutes
    page_views INT DEFAULT 0,
    actions_performed INT DEFAULT 0,
    
    -- Performance Metrics
    login_success BOOLEAN DEFAULT TRUE,
    login_time_ms INT DEFAULT 0, -- login processing time
    
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
);

-- =====================================================
-- 3. SECURITY_EVENTS TABLE
-- =====================================================
-- Stores security incidents and events for monitoring
CREATE TABLE IF NOT EXISTS security_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id INT,
    
    -- Event Details
    event_type VARCHAR(100) NOT NULL, -- failed_login, suspicious_activity, brute_force, etc.
    event_severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
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
);

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- The following tables have been created:
-- 1. user_sessions - Active login session management
-- 2. login_analytics - Login insights and patterns
-- 3. security_events - Security incident tracking
-- 
-- Note: user_db table already exists from previous setup
-- =====================================================
