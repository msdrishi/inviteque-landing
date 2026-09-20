const fs = require('fs');
let content = fs.readFileSync('src/pages/custom-orders/royal-heirloom/RohitAndManpreet/index.jsx', 'utf8');

// Update imports
content = content.replace(/from '\.\.\/context\/DraftContext\.jsx'/g, "from '../../../../context/DraftContext.jsx'");
content = content.replace(/from '\.\.\/weddingData\.js'/g, "from './data.js'");
content = content.replace(/from '\.\.\/components\//g, "from '../../../../components/");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomCover\.jsx'/g, "from '../../../../templates/royal-heirloom/RoyalHeirloomCover.jsx'");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomCountdown\.jsx'/g, "from '../../../../templates/royal-heirloom/RoyalHeirloomCountdown.jsx'");

// Update custom imports
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomHero\.jsx'/g, "from './components/RohitAndManpreetHero.jsx'");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomStory\.jsx'/g, "from './components/RohitAndManpreetStory.jsx'");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomStoryText\.jsx'/g, "from './components/RohitAndManpreetStoryText.jsx'");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomVenue\.jsx'/g, "from './components/RohitAndManpreetVenue.jsx'");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomSchedule\.jsx'/g, "from './components/RohitAndManpreetSchedule.jsx'");
content = content.replace(/from '\.\.\/templates\/royal-heirloom\/RoyalHeirloomCalendar\.jsx'/g, "from './components/RohitAndManpreetCalendar.jsx'");

// Fix component names in JSX
content = content.replace(/<RoyalHeirloomHero/g, "<RohitAndManpreetHero");
content = content.replace(/<RoyalHeirloomStory /g, "<RohitAndManpreetStory ");
content = content.replace(/<RoyalHeirloomStoryText/g, "<RohitAndManpreetStoryText");
content = content.replace(/<RoyalHeirloomVenue/g, "<RohitAndManpreetVenue");
content = content.replace(/<RoyalHeirloomSchedule/g, "<RohitAndManpreetSchedule");
content = content.replace(/<RoyalHeirloomCalendar/g, "<RohitAndManpreetCalendar");

// Fix component usages in component maps
content = content.replace(/RoyalHeirloomHero/g, "RohitAndManpreetHero");
content = content.replace(/RoyalHeirloomStory/g, "RohitAndManpreetStory");
content = content.replace(/RoyalHeirloomStoryText/g, "RohitAndManpreetStoryText");
content = content.replace(/RoyalHeirloomVenue/g, "RohitAndManpreetVenue");
content = content.replace(/RoyalHeirloomSchedule/g, "RohitAndManpreetSchedule");
content = content.replace(/RoyalHeirloomCalendar/g, "RohitAndManpreetCalendar");

// Update asset imports
content = content.replace(/from '\.\.\/assets\//g, "from '../../../../assets/");

// Update export name
content = content.replace(/export default function TemplateRoyalHeirloom/g, "export default function CustomRoyalHeirloomRohitAndManpreet");

fs.writeFileSync('src/pages/custom-orders/royal-heirloom/RohitAndManpreet/index.jsx', content);
console.log('Done');
