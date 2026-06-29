const fs = require('fs');
const file = 'c:/Users/Administrator/Desktop/creative app/backend/src/routes/aiParentInsights.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\${/g, '${');
fs.writeFileSync(file, content);
console.log('Fixed syntax errors');
