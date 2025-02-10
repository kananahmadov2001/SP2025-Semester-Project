import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Maximum connections to prevent overload
  queueLimit: 0,
});

export default pool;
