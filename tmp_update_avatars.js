const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'data', 'mockRecruiterData.js');
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/https:\/\/i\.pravatar\.cc\/150\?u=([^']+)/g, 'https://ui-avatars.com/api/?name=$1&background=0ea5e9&color=fff&bold=true');
fs.writeFileSync(file, data);
console.log('done');
