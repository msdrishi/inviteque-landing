const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/Template*.jsx');
files.push('src/templates/pink-blossom/index.jsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

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
    content = content.replace(/return\s*\\(\\s*<div/s, flagBlock + '\\n  return (\\n    <div');
  }

  if (content.includes('invitation: {') && !content.includes('message: welcomeMessage,')) {
    content = content.replace(/invitation:\\s*\\{/, 'invitation: {\\n      message: welcomeMessage,');
  }

  let lines = content.split('\\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    const tryWrap = (compName, flagName) => {
      const regex = new RegExp("<\\\\b" + compName + "\\\\b");
      const regexSelfClose = new RegExp("(<\\\\b" + compName + "\\\\b[^>]*/>)");
      if (line.match(regex) && !line.includes("{" + flagName + " &&")) {
        if (line.match(regexSelfClose)) {
          line = line.replace(regexSelfClose, "{" + flagName + " && $1}");
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
