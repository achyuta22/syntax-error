// index.js
const server = require('./server'); // Import the server from server.js

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
