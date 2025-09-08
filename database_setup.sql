-- Create user_db table for Nexpress Delivery user registration
-- Run this script in your MySQL database

CREATE TABLE user_db (
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
);

-- Create index on email for faster lookups
CREATE INDEX idx_email ON user_db(email);

-- Create index on username for faster lookups
CREATE INDEX idx_username ON user_db(username);

-- Create index on active and deleted for filtering
CREATE INDEX idx_status ON user_db(active, deleted);
