const {promptUser} = require('./prompt-user.cli');
const {setConfig, getConfig} = require('../config/config');

async function handleSettings(rl) {
    while (true) {
        console.clear();
        displaySettingsMenu();

        const choice = await promptUser(rl, 'Choose an option: ');

        switch (choice) {
            case '1':
                await modifyCollectionName(rl, 'USER_COLLECTION_NAME', 'User Collection');
                break;
            case '2':
                await modifyCollectionName(rl, 'DATA_COLLECTION_NAME', 'Data Collection');
                break;
            case '3':
                console.clear();
                return;
            default:
                console.log('⚠ Invalid option. Please try again.');
                await promptUser(rl);
        }
    }
}

async function modifyCollectionName(rl, configKey, label) {
    console.log(`\nCurrent value for ${label}: ${getConfig(configKey)}`)
    while (true) {
        const newName = await promptUser(rl, `Enter the new ${label} name (or type "back" to return): `);

        if (newName.toLowerCase() === 'back') {
            console.clear();
            return;
        }

        if (!newName.trim()) {
            console.log(`⚠ ${label} name cannot be empty. Please try again.`);
            continue;
        }

        setConfig(configKey, newName.trim());
        console.log(`✅ ${label} updated to: ${newName}`);
        await promptUser(rl);
        return;
    }
}

function displaySettingsMenu() {
    console.log('=============================');
    console.log('⚙️ Settings');
    console.log('=============================');
    console.log('1. 🔧 Modify User Collection');
    console.log('2. 🔧 Modify Data Collection');
    console.log('3. ⬅  Back to Main Menu');
}

module.exports = {handleSettings};