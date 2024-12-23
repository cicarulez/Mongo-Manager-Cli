const mongoose = require('mongoose');
const {getConfig} = require('../config/config'); // Import the configuration helper

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: false},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false}
}, {timestamps: true});

// Function to dynamically retrieve and create the model
function getUserModel() {
    const USER_COLLECTION_NAME = '' + getConfig('USER_COLLECTION_NAME');
    if (!USER_COLLECTION_NAME) {
        throw new Error('USER_COLLECTION_NAME is not defined in the configuration');
    }
    return mongoose.model(USER_COLLECTION_NAME, userSchema);
}

module.exports = getUserModel;
