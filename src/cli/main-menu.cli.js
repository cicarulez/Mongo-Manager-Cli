const readline = require('readline');
const {handleUserManagementMenu} = require('./user-management.cli');
const {handleExportOptionsMenu} = require('./export-options.cli');
const {connectToMongo} = require('../db/connection');
const {promptUser} = require('./prompt-user.cli');
const {version} = require('../../package.json');
const {getConfig} = require('../config/config.js');
const {handleSettings} = require("./settings.cli");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function mainMenu() {

    // console.clear();
    console.log('=============================');
    console.log('✨ Application Configuration');
    console.log(`🔖 Ver. ${version}`);
    console.log('=============================');
    console.log(`📦 MongoDB URL       : ${getConfig('MONGO_URL')}`);
    console.log(`🗂  Data Collection   : ${getConfig('DATA_COLLECTION_NAME')}`);
    console.log(`👤 User Collection   : ${getConfig('USER_COLLECTION_NAME')}`);
    console.log('=============================');

    const password = await promptUser(rl, 'Enter MongoDB password: ');
    try {
        await connectToMongo(password);
    } catch (error) {
        console.clear();
        console.error(`❌ Unable to connect to MongoDB: ${error.message}. Please try again.`);
        return;
    }

    while (true) {
        console.log('🌐 Main Menu');
        console.log('=============================');
        console.log('1. 👤 User Management');
        console.log('2. 🗂  Export Options');
        console.log('3. ⚙️ Settings');
        console.log('4. ❌ Exit');

        const choice = await promptUser(rl, 'Choose an option: ');

        switch (choice) {
            case '1':
                await handleUserManagementMenu(rl);
                break;
            case '2':
                await handleExportOptionsMenu(rl);
                break;
            case '3':
                await handleSettings(rl);
                break;
            case '4':
                rl.close();
                console.clear();
                console.log('✅ Exiting...');
                return;
            default:
                console.log('⚠ Invalid option. Please try again.');
                await promptUser(rl);
                console.clear();
        }


    }
}

module.exports = {mainMenu};