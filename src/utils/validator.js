const { getConfig } = require('../config/config');

/**
 * Validates the required environment variables.
 * @returns {Promise<string>} Resolves if the environment variables are valid, rejects otherwise.
 */
const validateEnvironment = async () => {
    return new Promise((resolve, reject) => {
        const {
            MONGO_URL,
            DATA_COLLECTION_NAME,
            USER_COLLECTION_NAME,
            ENABLE_EXCEL_EXPORT,
            CONVERTER_API_URL
        } = getConfig();

        // Check mandatory variables
        if (!MONGO_URL || !DATA_COLLECTION_NAME || !USER_COLLECTION_NAME) {
            reject(new Error(`❌ Environment variables MONGO_URL, DATA_COLLECTION_NAME, and USER_COLLECTION_NAME are required.`));
        } else if (!MONGO_URL.includes('<password>')) {
            reject(new Error(`❌ Environment variable MONGO_URL must contain '<password>'.`));
        }

        // Check ENABLE_EXCEL_EXPORT and CONVERTER_API_URL
        if (ENABLE_EXCEL_EXPORT === 'true' && !CONVERTER_API_URL) {
            reject(new Error(`❌ When ENABLE_EXCEL_EXPORT is true, CONVERTER_API_URL must be provided.`));
        }

        resolve('✅ Environment variables are valid.');
    });
};

module.exports = {
    validateEnvironment,
};
