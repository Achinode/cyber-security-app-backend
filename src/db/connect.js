// Import mongoose
const mongoose = require("mongoose");

// Database URL from environment variables or hard-coded string
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/csdb";

// Connect to the MongoDB database
mongoose
    .connect(dbURI)
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.error("Error connecting to the database", err);
    });

// Handle mongoose connection events
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from DB");
});

// Export the mongoose connection to be used in other files
module.exports = mongoose;
