// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const userController =require("../controllers/userController")

// Define your routes here
// router.get('/hey', (req, res) => {
//     res.send('Hello World'); // Send "Hello World" in response to GET requests on /api/hey
// });

router.post('/signUp',userController.signup);
router.post('/login',userController.login);

module.exports = router; // Export the router
