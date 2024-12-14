const path = require('path');

// Internal storage for configuration
let config = {
    MONGO_URL: process.env.MONGO_URL,
    DATA_COLLECTION_NAME: process.env.DATA_COLLECTION_NAME,
    USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME,
    EXPORT_DIR: path.join(__dirname, '../../exports'),
};

// Getter for configuration
const getConfig = (key) => {
    return key ? config[key] : {...config};
};

// Setter for configuration
const setConfig = (key, value) => {
    if (config.hasOwnProperty(key)) {
        config[key] = value;
    } else {
        throw new Error(`Invalid config key: ${key}`);
    }
};

module.exports = {
    getConfig,
    setConfig,
};