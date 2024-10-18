const express = require('express'); // Include Express
const router = express.Router(); // Create a new router instance
const hi=require("../controllers/hiController")
// Define a route for GET requests to '/'
router.get('/', hi);

// Export the router to be used in other parts of the app
module.exports = router;
