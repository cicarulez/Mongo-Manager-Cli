const {promptUser} = require('./prompt-user.cli');
const {setConfig} = require('../config/config');

async function handleSettings(rl) {
    while (true) {
        console.clear();
        displaySettingsMenu();

        const choice = await promptUser(rl, 'Choose an option: ');

        switch (choice) {
            case '1':
                if (await modifyCollectionName(rl, 'USER_COLLECTION_NAME', 'User Collection')) return;
                break;

            case '2':
                if (await modifyCollectionName(rl, 'DATA_COLLECTION_NAME', 'Data Collection')) return;
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
    while (true) {
        const newName = await promptUser(rl, `Enter the new ${label} name (or type "back" to return): `);

        if (newName.toLowerCase() === 'back') {
            console.clear();
            return false; // Indicates to stay in settings
        }

        if (!newName.trim()) {
            console.log(`⚠ ${label} name cannot be empty. Please try again.`);
            continue;
        }

        setConfig(configKey, newName.trim());
        console.log(`✅ ${label} updated to: ${newName}`);
        await promptUser(rl);
        return true; // Indicates successful update
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