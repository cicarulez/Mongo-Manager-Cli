const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

async function createUser(username, password) {
    const existingUser = await User.findOne({username});
    if (existingUser) throw new Error(`User "${username}" already exists.`);

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({username, password: hashedPassword});
    return `User "${username}" successfully created.`;
}

async function deleteUser(username) {
    const existingUser = await User.findOne({username});
    if (!existingUser) throw new Error(`User "${username}" does not exist.`);

    await User.deleteOne({username});
    return `User "${username}" successfully deleted.`;
}

async function changePassword(username, newPassword) {
    const existingUser = await User.findOne({username});
    if (!existingUser) throw new Error(`User "${username}" does not exist.`);

    existingUser.password = await bcrypt.hash(newPassword, 10);
    await existingUser.save();
    return `Password for "${username}" successfully updated.`;
}

async function listUsers() {
    const users = await User.find({}, {username: 1, _id: 0});
    return users.map(user => user.username);
}

module.exports = {createUser, deleteUser, changePassword, listUsers};