const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/Template*.jsx');
// Also add pink-blossom
files.push('src/templates/pink-blossom/index.jsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Standardize boolean flags
  const flagRegex = /const showGallery\s*=\s*.*?(?=const showSchedule|return \()/s;
  if (flagRegex.test(content)) {
    // Instead of replacing the whole block, let's just make sure all 5 flags exist.
    // Actually, it's safer to just inject a robust flags block before the return (
    const flagBlock = `
  const isGalleryView = !activeData;
  const showGallery = isGalleryView ? true : (savedData ? (savedData.invitationData?.showGallery ?? savedData.showGallery ?? true) : (draftData?.showGallery ?? true));
  const showSchedule = isGalleryView ? true : (savedData ? (savedData.invitationData?.showSchedule ?? savedData.showSchedule ?? true) : (draftData?.showSchedule ?? true));
  const showWelcome = isGalleryView ? true : (savedData ? (savedData.invitationData?.showWelcome ?? savedData.showWelcome ?? true) : (draftData?.showWelcome ?? true));
  const showVenue = isGalleryView ? true : (savedData ? (savedData.invitationData?.showVenue ?? savedData.showVenue ?? true) : (draftData?.showVenue ?? true));
  const showCountdown = isGalleryView ? true : (savedData ? (savedData.invitationData?.showCountdown ?? savedData.showCountdown ?? true) : (draftData?.showCountdown ?? true));
  const welcomeMessage = isGalleryView ? '' : (savedData ? (savedData.invitationData?.welcomeMessage || savedData.welcomeMessage || '') : (draftData?.welcomeMessage || ''));
`;
    // We can inject this right before `return (` if it's not already there.
    if (!content.includes('const showWelcome = isGalleryView')) {
      content = content.replace(/return\s*\(\s*<div/s, `${flagBlock}\n  return (\n    <div`);
    }
  }

  // 2. Wrap components in conditionals. We can use regex to find <Story, <Invitation, <Events, <Venue, <Countdown and wrap them if they aren't already.
  // <Story -> {showGallery && <Story ... />}
  const wrapComponent = (tag, flag) => {
    // regex to find `<Tag ... />` that is NOT preceded by `&&`
    const regex = new RegExp(`(?<!&&\\s*\\()(?<!&&\\s*)<${tag}\\b[^>]*/>`, 'g');
    content = content.replace(regex, (match) => {
      // Check if it's already wrapped in a block `{flag && <Tag />}`
      return `{${flag} && ${match}}`;
    });
  };

  wrapComponent('Story', 'showGallery');
  wrapComponent('TemplateRoyalHeritageStory', 'showGallery');
  wrapComponent('Invitation', 'showWelcome');
  wrapComponent('InvitationTwilightSerenade', 'showWelcome');
  wrapComponent('TemplateRoyalHeritageWelcome', 'showWelcome');
  wrapComponent('Events', 'showSchedule');
  wrapComponent('TemplateRoyalHeritageSchedule', 'showSchedule');
  wrapComponent('Venue', 'showVenue');
  wrapComponent('TemplateRoyalHeritageVenue', 'showVenue');
  wrapComponent('Countdown', 'showCountdown');
  wrapComponent('TemplateRoyalHeritageCountdown', 'showCountdown');

  // Also pass welcomeMessage to Invitation if it's mapping data.
  // If we see `invitation: {`, let's add message.
  if (content.includes('invitation: {')) {
    content = content.replace(/invitation:\s*\{/, 'invitation: {\n      message: activeData ? (savedData ? savedData.invitationData?.welcomeMessage : draftData?.welcomeMessage) : \'\',');
  }

  fs.writeFileSync(file, content, 'utf-8');
}
console.log('Done patching templates');
