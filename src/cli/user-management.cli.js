const { createUser, deleteUser, changePassword, listUsers } = require('../services/user-management.service');
const { promptUser } = require('./prompt-user.cli');

async function handleUserManagementMenu(rl) {
    let continueLoop = true;

    while (continueLoop) {
        console.clear();
        displayUserManagementMenu();

        const choice = await promptUser(rl, 'Choose an option: ');

        switch (choice) {
            case '1':
                await handleCreateUser(rl);
                break;
            case '2':
                await handleDeleteUser(rl);
                break;
            case '3':
                await handleChangePassword(rl);
                break;
            case '4':
                await handleListUsers(rl);
                break;
            case '5':
                console.clear();
                continueLoop = false;
                break;
            default:
                console.log('⚠ Invalid option. Please try again.');
                await promptUser(rl, 'Press Enter to continue...');
        }
    }
}

async function handleCreateUser(rl) {
    let continueLoop = true;

    while (continueLoop) {
        const username = await promptUser(rl, 'Enter username (or type "back" to return): ');

        if (username.toLowerCase() === 'back') {
            console.clear();
            continueLoop = false;
            continue;
        }

        if (!username.trim()) {
            console.log('⚠ Username cannot be empty. Please try again.');
            continue;
        }

        const password = await promptUser(rl, 'Enter password: ');

        try {
            console.log(await createUser(username, password));
        } catch (error) {
            console.error(`❌ Error during user creation: ${error.message}`);
        }

        const nextAction = await promptUser(rl, 'Do you want to create another user? (yes/no): ');
        if (nextAction.toLowerCase() !== 'yes' && nextAction.toLowerCase() !== 'y') {
            console.clear();
            continueLoop = false;
        }
    }
}

async function handleDeleteUser(rl) {
    let continueLoop = true;

    while (continueLoop) {
        const username = await promptUser(rl, 'Enter username to delete (or type "back" to return): ');

        if (username.toLowerCase() === 'back') {
            console.clear();
            continueLoop = false;
            continue;
        }

        if (!username.trim()) {
            console.log('⚠ Username cannot be empty. Please try again.');
            continue;
        }

        try {
            console.log(await deleteUser(username));
        } catch (error) {
            console.error(`❌ Error during user deletion: ${error.message}`);
        }

        const nextAction = await promptUser(rl, 'Do you want to delete another user? (yes/no): ');
        if (nextAction.toLowerCase() !== 'yes' && nextAction.toLowerCase() !== 'y') {
            console.clear();
            continueLoop = false;
        }
    }
}

async function handleChangePassword(rl) {
    let continueLoop = true;

    while (continueLoop) {
        const username = await promptUser(rl, 'Enter username (or type "back" to return): ');

        if (username.toLowerCase() === 'back') {
            console.clear();
            continueLoop = false;
            continue;
        }

        if (!username.trim()) {
            console.log('⚠ Username cannot be empty. Please try again.');
            continue;
        }

        const newPassword = await promptUser(rl, 'Enter new password: ');

        try {
            console.log(await changePassword(username, newPassword));
        } catch (error) {
            console.error(`❌ Error during password change: ${error.message}`);
        }

        const nextAction = await promptUser(rl, 'Do you want to change another password? (yes/no): ');
        if (nextAction.toLowerCase() !== 'yes' && nextAction.toLowerCase() !== 'y') {
            console.clear();
            continueLoop = false;
        }
    }
}

async function handleListUsers(rl) {
    try {
        console.log('📋 Users:', await listUsers());
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
    await promptUser(rl, 'Press Enter to continue...');
}

function displayUserManagementMenu() {
    console.log('=============================');
    console.log('👤 User Management');
    console.log('=============================');
    console.log('1. 📚 Create User');
    console.log('2. 🗑  Delete User');
    console.log('3. 🔑 Change Password');
    console.log('4. 📋 List Users');
    console.log('5. ⬅  Back to Main Menu');
}

module.exports = { handleUserManagementMenu };
