function getNestedKeys(obj, prefix = "") {
    const keys = [];
    for (const key in obj) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            keys.push(...getNestedKeys(obj[key], path));
        } else {
            keys.push(path);
        }
    }
    return keys;
}

function parseData(input) {
    const allKeys = new Set();
    input.forEach((item) => {
        getNestedKeys(item).forEach((key) => allKeys.add(key));
    });

    const keysArray = Array.from(allKeys);
    const header = keysArray.reduce((acc, key, index) => {
        acc[`col_${index + 1}`] = key;
        return acc;
    }, {});

    const rows = input.map((item) => {
        const row = {};
        keysArray.forEach((key, index) => {
            row[`col_${index + 1}`] = key.split('.').reduce((acc, part) => acc?.[part], item) || "";
        });
        return row;
    });

    return [header, ...rows];
}

function generateOutput(data, name) {
    return {
        data: {
            [`json_${name}_exports`]: parseData(data),
        },
        fileNamePrefix: `${name}_exports`,
    };
}

module.exports = {generateOutput};