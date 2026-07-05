const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error occured to connect DB");        
    }
}

module.exports = connectDB