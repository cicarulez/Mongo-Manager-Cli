const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const {getConfig} = require('../config/config.js');
const {generateOutput} = require('../utils/json-parser');
const axios = require('axios');

const EXPORT_DIR = path.join(getConfig('EXPORT_DIR'));

async function exportExcelData(collectionName) {

    const collection = mongoose.connection.collection(collectionName);
    const collectionData = await collection.find().toArray();

    const formattedData = collectionData.map((item) => ({
        ...item,
        _id: item._id.toString(),
    }));

    const data = generateOutput(formattedData, collectionName);

    const converterApiUrl = '' + getConfig('CONVERTER_API_URL');

    try {
        const response = await axios.post(converterApiUrl, data, {responseType: 'stream'});

        console.log('✅ Data successfully sent to the external API for Excel conversion.');

        // Extract filename from the response headers
        const contentDisposition = response.headers['content-disposition'];
        const match = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
        const fileName = match ? match[1] : `${collectionName}_export.xlsx`;

        const filePath = path.join(EXPORT_DIR, fileName);
        fs.mkdirSync(EXPORT_DIR, {recursive: true});

        // Save the file to the local directory
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`✅ Excel file saved to: ${filePath}`);
                resolve(filePath);
            });
            writer.on('error', (error) => {
                console.error('❌ Failed to save the Excel file:', error);
                reject(error);
            });
        });
    } catch (error) {
        console.error(`❌ Failed to export data to Excel: ${error.message}`);
        throw error;
    }
}


module.exports = {exportExcelData};