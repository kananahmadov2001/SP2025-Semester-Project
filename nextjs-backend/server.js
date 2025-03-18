// server.js

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
    const io = socketIo(httpServer); // Attach socket.io to the HTTP server

    // Handle socket connection
    io.on("connection", (socket) => {
        console.log("a user connected");

        // Handle receiving a global chat message
        socket.on("globalMessage", (message) => {
            console.log("Global message received:", message);
            // Broadcast message to all other clients
            socket.broadcast.emit("globalMessage", message);
        });

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