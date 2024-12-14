const {getConfig} = require('../config/config');

/**
 * Validates the required environment variables.
 * @returns {Promise<string>} Resolves if the environment variables are valid, rejects otherwise.
 */
const validateEnvironment = async () => {
    return new Promise((resolve, reject) => {
        const {MONGO_URL, DATA_COLLECTION_NAME, USER_COLLECTION_NAME} = getConfig();
        if (!MONGO_URL || !DATA_COLLECTION_NAME || !USER_COLLECTION_NAME) {
            reject(new Error(`❌ Environment variables MONGO_URL, DATA_COLLECTION_NAME, and USER_COLLECTION_NAME are required.`));
        } else if (!MONGO_URL.includes('<password>')) {
            reject(new Error(`❌ Environment variable MONGO_URL must contain '<password>'.`));
        } else {
            resolve('✅ Environment variables are valid.');
        }
    });
};

module.exports = {
    validateEnvironment,
};
