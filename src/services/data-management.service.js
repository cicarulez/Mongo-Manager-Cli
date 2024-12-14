const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const {getConfig} = require('../config/config.js');

const EXPORT_DIR = path.join(getConfig('EXPORT_DIR'));

async function exportData(collectionName) {
    const collection = mongoose.connection.collection(collectionName);
    const data = await collection.find().toArray();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${collectionName}_${timestamp}.json`;
    const filePath = path.join(EXPORT_DIR, fileName);

    fs.mkdirSync(EXPORT_DIR, {recursive: true});
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return filePath;
}

function listExportedFiles() {
    if (!fs.existsSync(EXPORT_DIR)) return [];

    return fs.readdirSync(EXPORT_DIR).filter(file => file.endsWith('.json'));
}

module.exports = {exportData, listExportedFiles};