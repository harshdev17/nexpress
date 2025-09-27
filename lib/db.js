import mysql from "mysql2";

export const db = mysql.createPool({
  host: "77.37.35.56",
  user: "u874817156_nexpress",
  password: "ZYe^=2fM#i1W",
  database: "u874817156_nexpress",
  waitForConnections: true,
  connectionLimit: 10000
});

export const user_db = mysql.createPool({
    host: "77.37.35.56",
    user: "u874817156_nexpress_user",
    password: "8&x&RzcT!yBx",
    database: "u874817156_nexpress_user",
    waitForConnections: true,
    connectionLimit: 10000
  });
  

  
export const old_db = mysql.createPool({
  host: "77.37.35.56",
  user: "u874817156_nexpress_old",
  password: "z+3VS#k75",
  database: "u874817156_nexpress_old",
  waitForConnections: true,
  connectionLimit: 10000
});


// Test the main database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Main database connection failed:', err);
    return;
  }
  console.log('Main database connected successfully!');
  connection.release();
});

// Test the user database connection
user_db.getConnection((err, connection) => {
  if (err) {
    console.error('User database connection failed:', err);
    return;
  }
  console.log('User database connected successfully!');
  connection.release();
});
