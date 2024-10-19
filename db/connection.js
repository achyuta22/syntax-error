// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://achyuta22:ravihal@cluster0.4119uaq.mongodb.net/SYNTAX-ERROR?retryWrites=true&w=majority&appName=Cluster0"
      
    );
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
