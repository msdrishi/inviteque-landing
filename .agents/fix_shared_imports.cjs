const fs = require('fs');
const path = require('path');
const dir = 'src/pages/custom-orders/royal-heirloom/RohitAndManpreet/components';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    content = content.replace(/from '\.\/RoyalHeirloomShared\.jsx'/g, "from '../../../../../templates/royal-heirloom/RoyalHeirloomShared.jsx'");
    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed imports in ' + file);
    }
  }
});
