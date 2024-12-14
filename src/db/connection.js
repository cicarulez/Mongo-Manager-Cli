const mongoose = require('mongoose');

async function connectToMongo(password) {
    if (!password || !process.env.MONGO_URL.includes('<password>')) {
        throw new Error('Password is missing or MONGO_URL is incorrectly formatted.');
    }

    const uri = process.env.MONGO_URL.replace('<password>', password);
    try {
        await mongoose.connect(uri);
        console.clear();
        console.log('✅ Connected to MongoDB.\n');
    } catch (error) {
        throw error;
    }
}

async function disconnectFromMongo() {
    try {
        await mongoose.connection.close();
        console.log(`🔌 Disconnected from MongoDB.`);
    } catch (error) {
        console.error(`❌ Failed to disconnect from MongoDB: ${error.message}`);
        throw error;
    }
}

module.exports = {connectToMongo, disconnectFromMongo};