const dotenv = require('dotenv');
const path = require('path');
// Load environment variables
dotenv.config(process.env.ENV_FILE ? { path: path.join(__dirname, process.env.ENV_FILE) } : {});
const {validateEnvironment} = require('./utils/validator');
const {mainMenu} = require('./cli/main-menu.cli');
const {disconnectFromMongo} = require('./db/connection');

// Self-invoking async function for initializing the application
(async () => {
    try {
        // Validate environment variables
        console.clear();
        const validationMessage = await validateEnvironment();
        console.log(validationMessage);

        // Start the main menu
        await mainMenu();
    } catch (error) {
        console.error(`❌ Application error: ${error.message}`);
    } finally {
        await disconnectFromMongo();
        process.exit(1); // Ensure process exits when the application is done
    }
})();