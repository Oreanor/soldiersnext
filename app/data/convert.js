const fs = require('fs');
const path = require('path');

// Read JSON file
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// Define CSV headers
const headers = ['id', 'name', 'manufacturer', 'scale', 'year', 'folder', 'img', 'material', 'type', 'desc', 'figures'];

// Convert JSON to CSV
const csvRows = [
    headers.join(','), // Add headers as first row
    ...jsonData.map(item => {
        // Process figures array to string
        const figuresStr = item.figures ? 
            item.figures.map(figure => figure.name || '').join(';') : 
            '';
        
        // Escape fields that might contain commas
        const escapeField = (field) => {
            if (typeof field === 'string' && (field.includes(',') || field.includes('"'))) {
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field || '';
        };

        return [
            item.id,
            escapeField(item.name),
            escapeField(item.manufacturer),
            item.scale,
            item.year,
            escapeField(item.folder),
            escapeField(item.img),
            escapeField(item.material),
            escapeField(item.type),
            escapeField(item.desc),
            escapeField(figuresStr)
        ].join(',');
    })
];

// Write to CSV file
fs.writeFileSync(
    path.join(__dirname, 'data.csv'),
    csvRows.join('\n')
);

console.log('Data has been converted to CSV and saved to data.csv'); 