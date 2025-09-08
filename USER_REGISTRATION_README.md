# Nexpress Delivery - User Registration System

## 🎯 **Complete User Registration System**

This system provides a fully functional user registration and authentication system for Nexpress Delivery.

## 📋 **Features Implemented:**

### ✅ **Database Structure**
- **Table**: `user_db` with all required fields
- **Unique Username**: Auto-generated from email
- **Password Security**: Bcrypt hashing (12 salt rounds)
- **Status Management**: Active/Deleted flags
- **Timestamps**: Joining date and update tracking

### ✅ **API Endpoints**
- **POST `/api/auth/register`** - User registration
- **POST `/api/auth/login`** - User authentication

### ✅ **Form Features**
- **Real-time Validation** - Client-side error checking
- **Server-side Validation** - Comprehensive data validation
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during submission
- **Success Redirect** - Automatic redirect after registration

### ✅ **Security Features**
- **Password Hashing** - Secure bcrypt implementation
- **Email Validation** - Proper email format checking
- **Duplicate Prevention** - Email and username uniqueness
- **Input Sanitization** - Data cleaning and trimming
- **SQL Injection Protection** - Parameterized queries

## 🗄️ **Database Schema**

```sql
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
```

## 🚀 **How to Use**

### 1. **Setup Database**
Run the SQL script in `database_setup.sql` in your MySQL database.

### 2. **Install Dependencies**
```bash
npm install bcryptjs mysql2
```

### 3. **Configure Database**
Update `lib/db.js` with your database credentials.

### 4. **Access Registration**
Navigate to `/customer/register` to access the registration form.

## 📝 **Form Fields**

### **Required Fields:**
- First Name
- Last Name
- Telephone
- Email
- Address Line 1
- City
- Postcode
- Country
- Password
- Confirm Password

### **Optional Fields:**
- Company
- Mobile
- Address Line 2
- State/Province/County

### **Auto-Generated Fields:**
- Username (from email)
- Type (retail)
- Customer Group (3)
- Customer Reference (null)
- Special Customer (no)
- Active (1)
- Deleted (0)
- Joining Date (current timestamp)

## 🔧 **API Response Format**

### **Successful Registration:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 123,
  "username": "john_doe"
}
```

### **Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🛡️ **Security Features**

1. **Password Security**: 12-round bcrypt hashing
2. **Input Validation**: Both client and server-side
3. **SQL Injection Protection**: Parameterized queries
4. **Email Uniqueness**: Prevents duplicate registrations
5. **Username Generation**: Automatic unique username creation
6. **Data Sanitization**: Trimming and cleaning input data

## 📱 **User Experience**

1. **Real-time Validation**: Errors show as user types
2. **Loading States**: Visual feedback during submission
3. **Success Feedback**: Clear success message with username
4. **Automatic Redirect**: Goes to login page after registration
5. **Error Handling**: Clear, user-friendly error messages

## 🔄 **Next Steps**

The registration system is complete and ready for use. You can now:
1. Test the registration form
2. Implement session management
3. Add password reset functionality
4. Create user profile management
5. Add email verification (optional)

## 📞 **Support**

If you encounter any issues:
1. Check database connection in `lib/db.js`
2. Verify all dependencies are installed
3. Ensure the database table is created correctly
4. Check browser console for any JavaScript errors

---

**✅ Registration System Status: COMPLETE AND READY TO USE**
