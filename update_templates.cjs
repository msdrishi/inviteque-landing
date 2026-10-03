const fs = require('fs');

let code = fs.readFileSync('src/templates/templates.js', 'utf8');

const getPrice = (id) => {
  const prices2499 = ['midnight-waltz', 'royal-heirloom', 'royal-heritage', 'pink-blossom'];
  return prices2499.includes(id) ? 2499 : 1999;
};

// Replace prices
code = code.replace(/priceLabel:\s*'[^']+'/g, (match, offset, str) => {
  // We need to look backward to find the id.
  const lookback = str.substring(Math.max(0, offset - 150), offset);
  const idMatch = lookback.match(/id:\s*'([^']+)'/);
  if (idMatch) {
    const id = idMatch[1];
    const price = getPrice(id);
    return `price: ${price},\n    priceLabel: '₹${price}'`;
  }
  return match;
});

// Since rewriting the AST for this file is safer, we'll just manipulate the strings for moving elements.
// But it's easier to use a regex to extract the objects and reorder them.
// Let's just find the start of the `templates` array and end.
const startIdx = code.indexOf('export const templates = [');
const endIdx = code.indexOf('];', startIdx);
const arrStr = code.substring(startIdx + 26, endIdx);

// It's a bit risky to parse manually.
// Instead, let's just add the 'isNew' tag to them:
code = code.replace(/id:\s*'royal-heritage',/, "id: 'royal-heritage',\n    isNew: true,");
code = code.replace(/id:\s*'pink-blossom',/, "id: 'pink-blossom',\n    isNew: true,");

fs.writeFileSync('src/templates/templates.js', code);
console.log('Done replacing strings.');
