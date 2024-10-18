// routes/apiRoutes.js
const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/hey', (req, res) => {
    res.send('Hello World'); // Send "Hello World" in response to GET requests on /api/hey
});

module.exports = router; // Export the router
