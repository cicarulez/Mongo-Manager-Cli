const readline = require('readline');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


const envFile = process.env.ENV_FILE || '.env'; // Default to `.env` if not provided
dotenv.config({ path: path.join(__dirname, envFile) });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MONGO_URL = process.env.MONGO_URL;
const DATA_COLLECTION_NAME = process.env.DATA_COLLECTION_NAME;
const USER_COLLECTION_NAME = process.env.USER_COLLECTION_NAME;

if (!MONGO_URL || !DATA_COLLECTION_NAME || !USER_COLLECTION_NAME) {
    console.error(`❌ Environment variables MONGO_URL, DATA_COLLECTION_NAME, and USER_COLLECTION_NAME are required.`);
    process.exit(1);
} else if (!MONGO_URL.includes('<password>')) {
    console.error(`❌ Environment variable MONGO_URL must contain '<password>'.`);
    process.exit(1);
} else {
    console.log('=============================');
    console.log('✨ Application Configuration');
    console.log('=============================');
    console.log(`🌍 Environment       : ${process.env.NODE_ENV || 'development'} (${envFile})`);
    console.log(`📦 MongoDB URL       : ${MONGO_URL}`);
    console.log(`📂 Data Collection   : ${DATA_COLLECTION_NAME}`);
    console.log(`👤 User Collection   : ${USER_COLLECTION_NAME}`);
    console.log('=============================');
}

async function connectToMongo(password) {
    const uri = MONGO_URL.replace('<password>', password);
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB.');
    } catch (error) {
        console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model(USER_COLLECTION_NAME, userSchema);

async function handleUserManagement() {
    while (true) {
        console.log('\n=============================');
        console.log('👤 User Management');
        console.log('=============================');
        console.log('1. 📚 Create User');
        console.log('2. 🗑 Delete User');
        console.log('3. 🔑 Change Password');
        console.log('4. ⬅ Back to Main Menu');

        const choice = await promptUser('Choose an option: ');

        if (choice === '1') {
            await handleCreateUser();
        } else if (choice === '2') {
            await handleDeleteUser();
        } else if (choice === '3') {
            await handleChangePassword();
        } else if (choice === '4') {
            break;
        } else {
            console.log('⚠ Invalid option. Please try again.');
        }
    }
}

async function handleCreateUser() {
    while (true) {
        const username = await promptUser('Enter username for new user (or type "back" to return): ');
        if (username.toLowerCase() === 'back') break;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('⚠ User already exists.');
        } else {
            const plainPassword = await promptUser('Enter password for new user: ');
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            await User.create({ username, password: hashedPassword });
            console.log('✅ User created successfully.');
        }
    }
}

async function handleDeleteUser() {
    while (true) {
        const username = await promptUser('Enter username of the user to delete (or type "back" to return): ');
        if (username.toLowerCase() === 'back') break;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            console.log('⚠ User does not exist.');
        } else {
            await User.deleteOne({ username });
            console.log('✅ User deleted successfully.');
        }
    }
}

async function handleChangePassword() {
    while (true) {
        const username = await promptUser('Enter username of the user to change password (or type "back" to return): ');
        if (username.toLowerCase() === 'back') break;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            console.log('⚠ User does not exist.');
        } else {
            const newPassword = await promptUser('Enter new password: ');
            existingUser.password = await bcrypt.hash(newPassword, 10);
            await existingUser.save();
            console.log('✅ Password changed successfully.');
        }
    }
}

async function handleDataExport() {
    const collection = mongoose.connection.collection(DATA_COLLECTION_NAME);
    const data = await collection.find().toArray();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${DATA_COLLECTION_NAME}_${timestamp}.json`;
    const filePath = path.join(__dirname, 'exports', fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Data exported to ${filePath}`);
}

function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
}

(async function main() {
    const password = await promptUser('Enter MongoDB password: ');
    await connectToMongo(password);

    while (true) {
        console.log('\n=============================');
        console.log('🌐 Main Menu');
        console.log('=============================');
        console.log('1. 👤 User Management');
        console.log('2. 📂 Export Data');
        console.log('3. ❌ Exit');

        const choice = await promptUser('Choose an option: ');

        if (choice === '1') {
            await handleUserManagement();
        } else if (choice === '2') {
            await handleDataExport();
        } else if (choice === '3') {
            console.log('✅ Exiting...');
            break;
        } else {
            console.log('⚠ Invalid option. Please try again.');
        }
    }

    rl.close();
    mongoose.connection.close();
})();
