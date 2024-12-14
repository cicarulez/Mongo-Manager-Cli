const mongoose = require('mongoose');
const {getConfig} = require('../config/config'); // Import the configuration helper

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

// Dynamically retrieve the collection name
const USER_COLLECTION_NAME = getConfig('USER_COLLECTION_NAME');

module.exports = mongoose.model('' + USER_COLLECTION_NAME, userSchema);
