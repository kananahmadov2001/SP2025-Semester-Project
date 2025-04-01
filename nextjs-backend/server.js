import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mysql from "mysql2/promise"; // Import mysql2 with promise support
import dotenv from "dotenv";

// Initialize dotenv to use environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration: explicitly specify the origin and allow credentials
const corsOptions = {
    origin: "http://localhost:5173", // Allow requests from this frontend URL
    methods: ["GET", "POST"], // Allow only GET and POST methods
    credentials: true, // Allow credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from this frontend URL
        methods: ["GET", "POST"], // Allow only GET and POST methods
        credentials: true, // Allow credentials for WebSocket connections
    },
});


// Set up MySQL connection pool directly in server.js
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maximum connections to prevent overload
    queueLimit: 0,
});


app.use(express.json());

// WebSocket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async ({ username, message }) => {
        if (!username || !message) return;

        try {
            // Query the database to insert the message
            const [result] = await pool.query("INSERT INTO messages (username, message) VALUES (?, ?)", [username, message]);
            const newMessage = { id: result.insertId, username, message, timestamp: new Date() };

            // Broadcast message to all clients
            io.emit("receiveMessage", newMessage);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Fetch messages from MySQL
app.get("/messages", async (req, res) => {
    try {
        const [messages] = await pool.query("SELECT * FROM messages ORDER BY timestamp DESC");
        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Start the server
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
