// server.js
const express = require("express");
const cors = require('cors');
const { createServer } = require('node:http'); // Import the Node.js HTTP module
const { Server } = require("socket.io"); // Import Socket.IO
const apiRoutes = require('./routes/apiRoutes'); // Import API routes

const app = express(); // Create an instance of the Express application
const server = createServer(app); // Create an HTTP server using the Express app
const io = new Server(server); // Integrate Socket.IO with the server

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for cross-origin requests
// Use the API routes
app.use('/api', apiRoutes); // Define base URL for API routes
console.log("hello")
// Socket.IO connection
io.on('connection', require('./controllers/socketController')(io)); // Use controller for Socket.IO

module.exports = server; // Export the server for use in index.js
