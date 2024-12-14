const {exportData, listExportedFiles} = require('../services/data-management.service');
const {promptUser} = require('./prompt-user.cli');
const {getConfig} = require('../config/config.js');
const {exportExcelData} = require('../services/excel-export.service');

async function handleExportOptionsMenu(rl) {
    const enableExcelExport = getConfig('ENABLE_EXCEL_EXPORT') === 'true';

    while (true) {
        console.clear();
        console.log('=============================');
        console.log('🗂  Export Options');
        console.log('=============================');
        console.log(`📂 Current Collection: ${getConfig('DATA_COLLECTION_NAME')}`);
        console.log('=============================');
        console.log('1. 📅 Export Data');
        if (enableExcelExport) {
            console.log('2. 📊 Export Data to Excel');
        }
        console.log(`${enableExcelExport ? '3' : '2' }. 🔗 List Exported Data`);
        console.log(`${enableExcelExport ? '4' : '3' }. ⬅  Back to Main Menu`);

        const choice = await promptUser(rl, 'Choose an option: ');

        switch (choice) {
            case '1':
                const filePath = await exportData(getConfig('DATA_COLLECTION_NAME'));
                console.log(`✅ Data exported to ${filePath}`);
                break;
            case '2':
                if (enableExcelExport) {
                    await exportExcelData(getConfig('DATA_COLLECTION_NAME'));
                } else {
                    const files = listExportedFiles();
                    console.log('Exported Files:', files.length ? files : 'No exports found.');
                }
                break;
            case '3':
                if (!enableExcelExport) {
                    const files = listExportedFiles();
                    console.log('Exported Files:', files.length ? files : 'No exports found.');
                } else {
                    console.clear();
                    return;
                }
                break;
            case '4':
                if (enableExcelExport) {
                    console.clear();
                    return;
                }
                // If not in Excel export mode, '4' is invalid
                console.log('⚠ Invalid option. Please try again.');
                break;
            default:
                console.log('⚠ Invalid option. Please try again.');
        }


        await promptUser(rl);
    }
}

module.exports = {handleExportOptionsMenu};