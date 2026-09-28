const mongoose = require("mongoose");

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("✅ Database is connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:");
        console.error(err);
    }
}

module.exports = connectToDb;