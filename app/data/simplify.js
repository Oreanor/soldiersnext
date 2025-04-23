const fs = require('fs');
const path = require('path');

// Read JSON file
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// Process data - simplify figures array to just names
const simplifiedData = jsonData.map(item => {
    return {
        ...item,
        figures: item.figures ? item.figures.map(figure => figure.name || '') : []
    };
});

// Write back to JSON file
fs.writeFileSync(
    path.join(__dirname, 'data_simplified.json'),
    JSON.stringify(simplifiedData, null, 2)
);

console.log('Data has been simplified and saved to data_simplified.json'); 