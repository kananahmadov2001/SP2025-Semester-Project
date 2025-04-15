const express = require("express");
const http = require("http");
const next = require("next");
const socketIo = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIo(httpServer, {
        cors: {
            origin: "*", // Allow all origins (or specify your frontend URL)
            methods: ["GET", "POST"]
        }
    });

    // Handle socket connection
    io.on("connection", (socket) => {
        console.log("a user connected");

        // Listen for when a user selects a league (join a league chat room)
        socket.on("joinLeague", (leagueId) => {
            console.log(`User joined league: ${leagueId}`);
            // Join the room for the selected league
            socket.join(leagueId);
        });

        // Listen for global chat messages
        socket.on("globalMessage", (message) => {
            console.log("Global message received:", message);
            // Broadcast to all users except the sender
            socket.broadcast.emit("globalMessage", message);
        });

        // Listen for league chat messages and broadcast to that specific league room
        socket.on("leagueMessage", (message, leagueId) => {
            console.log(`League message received for league ${leagueId}:`, message);
            // Broadcast to only users in the specific league's room
            socket.to(leagueId).emit("leagueMessage", message);
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    const port = 3000;
    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
