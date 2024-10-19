// index.js
// const server = require("./server"); // Import the server from server.js
const express=require("express");
const connectDB= require("./db/connection");
const PORT = 5000;
const app= express();
const cors=require("cors");
 // server.js
// const express = require("express");
// const cors = require('cors');
// const { createServer } = require('node:http'); // Import the Node.js HTTP module
// const { Server } = require("socket.io"); // Import Socket.IO
const apiRoutes = require('./routes/apiRoutes'); // Import API routes

// const app = express(); // Create an instance of the Express application
// const server = createServer(app); // Create an HTTP server using the Express app
// const io = new Server(server); // Integrate Socket.IO with the server

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for cross-origin requests
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      `http://localhost:3000`,
      `http://localhost:3001`,
      `http://3.109.154.34/`,
      `http://3.109.154.34`,
      `http://eazeplace.com/`,
      `http://eazeplace.com`,
      `http://15.206.117.10:3000`,
      `http://13.232.95.206:3000`,
      `https://localhost:3000`,
      `https://eazeplace.com`,
      `https://eazeplace.com/`,
            `https://syntax-erro-frontend-git-main-eazeplace.vercel.app`,
     `http://13.201.229.174/`

    ],
  })
);
// Use the API routes
app.use('/api', apiRoutes); // Define base URL for API routes
console.log("hello")
connectDB();
const server=app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// Socket.IO connection
const io = require("socket.io")(server, {
    pingTimeOut: 600000,
    cors: {
      origin: [
        `http://localhost:3000`,
        `http://3.109.154.34/`,
        `http://3.109.154.34`,
        `http://eazeplace.com/`,
        `http://eazeplace.com`,
        `http://15.206.117.10:3000`,
        `http://13.232.95.206:3000`,
        `https://localhost:3000`,
        `https://eazeplace.com`,
        `https://eazeplace.com/`,
       `https://syntax-erro-frontend-git-main-eazeplace.vercel.app`,
            `http://13.201.229.174/`


      ],
    },
  });
io.on('connection', require('./controllers/socketController')(io)); // Use controller for Socket.IO

module.exports = server; // Export the server for use in index.js


