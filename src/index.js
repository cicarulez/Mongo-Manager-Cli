const readline = require('readline');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(process.env.ENV_FILE ? {path: path.join(__dirname, process.env.ENV_FILE)} : {});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const exitAliases = ['back', 'quit', 'stop', 'exit'];
const MONGO_URL = process.env.MONGO_URL;
const DATA_COLLECTION_NAME = process.env.DATA_COLLECTION_NAME;
const USER_COLLECTION_NAME = process.env.USER_COLLECTION_NAME;
const EXPORT_DIR = path.join(__dirname, '../exports');

if (!MONGO_URL || !DATA_COLLECTION_NAME || !USER_COLLECTION_NAME) {
    console.error(`❌ Environment variables MONGO_URL, DATA_COLLECTION_NAME, and USER_COLLECTION_NAME are required.`);
    process.exit(1);
} else if (!MONGO_URL.includes('<password>')) {
    console.error(`❌ Environment variable MONGO_URL must contain '<password>'.`);
    process.exit(1);
} else {
    console.clear();
    console.log('=============================');
    console.log('✨ Application Configuration');
    console.log('=============================');
    console.log(`📦 MongoDB URL       : ${MONGO_URL}`);
    console.log(`🗂  Data Collection   : ${DATA_COLLECTION_NAME}`);
    console.log(`👤 User Collection   : ${USER_COLLECTION_NAME}`);
    console.log(`📁 Export Directory  : ${EXPORT_DIR}`);
    console.log('=============================');
}

async function connectToMongo(password) {
    const uri = MONGO_URL.replace('<password>', password);
    try {
        await mongoose.connect(uri);
        console.clear();
        console.log('✅ Connected to MongoDB.\n');
    } catch (error) {
        console.clear();
        console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model(USER_COLLECTION_NAME, userSchema);

(async function main() {
    const password = await promptUser('Enter MongoDB password: ');
    await connectToMongo(password);

    while (true) {
        console.log('=============================');
        console.log('🌐 Main Menu');
        console.log('=============================');
        console.log('1. 👤 User Management');
        console.log('2. 🗂 Export Options');
        console.log('3. ❌ Exit');

        const choice = await promptUser('Choose an option: ');

        if (exitAliases.includes(choice) || choice === '3') {
            console.clear();
            console.log('✅ Exiting...');
            break;
        }

        switch (choice) {
            case '1':
                console.clear();
                await handleUserManagement();
                break;
            case '2':
                console.clear();
                await handleExportMenu();
                break;
            default:
                console.log('⚠ Invalid option. Please try again.');
        }
    }

    rl.close();
    await mongoose.connection.close();
})();

async function handleUserManagement() {
    while (true) {
        console.clear();
        console.log('=============================');
        console.log('👤 User Management');
        console.log('=============================');
        console.log('1. 📚 Create User');
        console.log('2. 🖑 Delete User');
        console.log('3. 🔑 Change Password');
        console.log('4. 📋 List Users');
        console.log('5. ⬅ Back to Main Menu');

        const choice = await promptUser('Choose an option: ');

        if (exitAliases.includes(choice) || choice === '5') {
            console.clear();
            break;
        }

        switch (choice) {
            case '1':
                console.clear();
                await handleCreateUser();
                break;
            case '2':
                console.clear();
                await handleDeleteUser();
                break;
            case '3':
                console.clear();
                await handleChangePassword();
                break;
            case '4':
                console.clear();
                await listUsers();
                break;
            default:
                console.log('⚠ Invalid option. Please try again.');
        }
    }
}

async function handleExportMenu() {
    while (true) {
        console.clear();
        console.log('=============================');
        console.log('🗂 Export Options');
        console.log('=============================');
        console.log('1. 📅 Export Data');
        console.log('2. 🔗 List Data');
        console.log('3. ⬅ Back to Main Menu');

        const exportChoice = await promptUser('Choose an option: ');

        if (exitAliases.includes(exportChoice) || exportChoice === '3') {
            console.clear();
            break;
        }

        switch (exportChoice) {
            case '1':
                console.clear();
                await handleDataExport();
                break;
            case '2':
                console.clear();
                await handleListData();
                break;
            default:
                console.log('⚠ Invalid option. Please try again.');
        }
    }
}

async function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
}

async function handleCreateUser() {
    while (true) {
        const username = await promptUser('Enter username for new user (or type "back" to return): ');
        if (exitAliases.includes(username.toLowerCase())) break;

        if (!username) {
            console.log('⚠ Username cannot be empty. Please try again.\n');
            continue;
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            console.log(`⚠ User "${username}" already exists.\n`);
        } else {
            const plainPassword = await promptUser(`Enter password for ${username}: `);
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            await User.create({username, password: hashedPassword});
            console.log(`✅ User "${username}" successfully created.\n`);
        }

    }
}

async function handleDeleteUser() {
    while (true) {
        const username = await promptUser('Enter username of the user to delete (or type "back" to return): ');
        if (exitAliases.includes(username.toLowerCase())) break;

        if (!username) {
            console.log('⚠ Username cannot be empty. Please try again.\n');
            continue;
        }

        const existingUser = await User.findOne({username});
        if (!existingUser) {
            console.log(`⚠ User "${username}" does not exist.\n`);
        } else {
            await User.deleteOne({username});
            console.log(`✅ User "${username}" successfully deleted.\n`);
        }

    }
}

async function handleChangePassword() {
    while (true) {
        const username = await promptUser('Enter username of the user to change password (or type "back" to return): ');
        if (exitAliases.includes(username.toLowerCase())) break;

        if (!username) {
            console.log('⚠ Username cannot be empty. Please try again.\n');
            continue;
        }

        const existingUser = await User.findOne({username});
        if (!existingUser) {
            console.log(`⚠ User "${username}" does not exist.\n`);
        } else {
            const newPassword = await promptUser('Enter new password: ');
            existingUser.password = await bcrypt.hash(newPassword, 10);
            await existingUser.save();
            console.log('✅ Password changed successfully.');
        }
        
    }
}


async function listUsers() {
    const users = await User.find({}, { username: 1, _id: 0 });
    if (users.length === 0) {
        console.log('⚠ No users found.');
    } else {
        console.log('📋 List of Users:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.username}`);
        });
    }

    await waitForEnter();
}

async function handleDataExport() {
    const collection = mongoose.connection.collection(DATA_COLLECTION_NAME);
    const data = await collection.find().toArray();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${DATA_COLLECTION_NAME}_${timestamp}.json`;
    const filePath = path.join(EXPORT_DIR, fileName);

    fs.mkdirSync(EXPORT_DIR, {recursive: true});
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Data exported to ${filePath}`);

    await waitForEnter();
}

async function handleListData() {
    if (!fs.existsSync(EXPORT_DIR)) {
        console.log('⚠ Export directory does not exist.');
        
        await waitForEnter();
        return;
    }

    const files = fs.readdirSync(EXPORT_DIR).filter((file) => file.endsWith('.json'));
    if (files.length === 0) {
        console.log('⚠ No exports found.');
    } else {
        console.log('Exported Files:\n');
        files.forEach((file, index) => {
            console.log(`${index + 1}. ${file}`);
        });
    }
    
    await waitForEnter();
}

function waitForEnter() {
    return new Promise((resolve) => {
        rl.question('\nPress Enter to continue...', () => {
            resolve();
        });
    });
}
