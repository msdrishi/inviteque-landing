const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/Template*.jsx');
files.push('src/templates/pink-blossom/index.jsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Inject the flagBlock if not present
  const flagBlock = `
  const isGalleryView = !activeData;
  const showGallery = isGalleryView ? true : (savedData ? (savedData.invitationData?.showGallery ?? savedData.showGallery ?? true) : (draftData?.showGallery ?? true));
  const showSchedule = isGalleryView ? true : (savedData ? (savedData.invitationData?.showSchedule ?? savedData.showSchedule ?? true) : (draftData?.showSchedule ?? true));
  const showWelcome = isGalleryView ? true : (savedData ? (savedData.invitationData?.showWelcome ?? savedData.showWelcome ?? true) : (draftData?.showWelcome ?? true));
  const showVenue = isGalleryView ? true : (savedData ? (savedData.invitationData?.showVenue ?? savedData.showVenue ?? true) : (draftData?.showVenue ?? true));
  const showCountdown = isGalleryView ? true : (savedData ? (savedData.invitationData?.showCountdown ?? savedData.showCountdown ?? true) : (draftData?.showCountdown ?? true));
  const welcomeMessage = isGalleryView ? '' : (savedData ? (savedData.invitationData?.welcomeMessage || savedData.welcomeMessage || '') : (draftData?.welcomeMessage || ''));
`;
  if (!content.includes('const showWelcome = isGalleryView')) {
    content = content.replace(/return\s*\(\s*<div/s, `${flagBlock}\n  return (\n    <div`);
  }

  // 2. We need to pass the welcomeMessage to the Invitation component mapping (if it exists)
  if (content.includes('invitation: {') && !content.includes('message: welcomeMessage,')) {
    content = content.replace(/invitation:\s*\{/, 'invitation: {\n      message: welcomeMessage,');
  }

  // 3. For the JSX tags, it's safer to not use a naive regex for replacing React tags, because we might wrap them twice or wrap them incorrectly.
  // We can look for exact matches that we know are safe, for example:
  // `<Story data={data.story} />` -> `{showGallery && <Story data={data.story} />}`
  // Let's just do targeted string replacements for known templates if needed, OR we can use a more precise regex.
  // Instead of replacing, let's just find <Story, <Invitation, <Events, <Venue, <Countdown and if they are at the start of a line (possibly with spaces), wrap them.
  // ONLY if they don't already have {show... && 

  const wrapComponent = (compName, flagName) => {
    // Matches whitespace, then <CompName ... /> or <CompName ... > ... </CompName>
    // We will use a regex that matches the tag start and the closing /> or </CompName>
    // Actually, we can just replace `<CompName ` with `{${flagName} && <CompName `
    // BUT we have to close the curly brace! This is very hard with regex.
  }

  // Let's write a simple state machine to find the JSX tags and wrap them.
  let lines = content.split('\\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    const tryWrap = (compName, flagName) => {
      // If line contains the component but is NOT already wrapped
      if (line.match(new RegExp(\`<\\b\${compName}\\b\`)) && !line.includes(\`{\${flagName} &&\`)) {
        // Find if the tag is self closing on the same line
        if (line.match(new RegExp(\`<\\b\${compName}\\b[^>]*/>\`))) {
          line = line.replace(new RegExp(\`(<\\b\${compName}\\b[^>]*/>)\`), \`{\${flagName} && $1}\`);
        }
      }
    };

    tryWrap('Story', 'showGallery');
    tryWrap('TemplateRoyalHeritageStory', 'showGallery');
    tryWrap('Invitation', 'showWelcome');
    tryWrap('TemplateRoyalHeritageWelcome', 'showWelcome');
    tryWrap('InvitationTwilightSerenade', 'showWelcome');
    tryWrap('Events', 'showSchedule');
    tryWrap('TemplateRoyalHeritageSchedule', 'showSchedule');
    tryWrap('Venue', 'showVenue');
    tryWrap('TemplateRoyalHeritageVenue', 'showVenue');
    tryWrap('Countdown', 'showCountdown');
    tryWrap('TemplateRoyalHeritageCountdown', 'showCountdown');
    
    lines[i] = line;
  }
  
  content = lines.join('\\n');
  fs.writeFileSync(file, content, 'utf-8');
}
console.log("Done");
