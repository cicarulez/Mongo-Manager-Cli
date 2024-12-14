const {exportData, listExportedFiles} = require('../services/data-management.service');
const {promptUser} = require('./prompt-user.cli');
const {getConfig} = require('../config/config.js');

async function handleExportOptionsMenu(rl) {
    while (true) {
        console.clear();
        console.log('=============================');
        console.log('🗂 Export Options');
        console.log('=============================');
        console.log(`📂 Current Collection: ${getConfig('DATA_COLLECTION_NAME')}`);
        console.log('=============================');
        console.log('1. 📅 Export Data');
        console.log('2. 🔗 List Exported Data');
        console.log('3. ⬅  Back to Main Menu');

        const choice = await promptUser(rl, 'Choose an option: ');

        switch (choice) {
            case '1':
                const filePath = await exportData(getConfig('DATA_COLLECTION_NAME'));
                console.log(`✅ Data exported to ${filePath}`);
                break;
            case '2':
                const files = listExportedFiles();
                console.log('Exported Files:', files.length ? files : 'No exports found.');
                break;
            case '3':
                console.clear();
                return;
            default:
                console.log('⚠ Invalid option. Please try again.');
        }

        await promptUser(rl);
    }
}

module.exports = {handleExportOptionsMenu};