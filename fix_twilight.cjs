const fs = require('fs');

function processTemplate(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // TwilightSerenade
  if (filePath.includes('TemplateTwilightSerenade.jsx')) {
    // 1. Add variables
    if (!content.includes('const groomScale')) {
      content = content.replace(
        `    // Fallback if formatting differs\r\n    return { day: '18', month: '12', year: '2026' }\r\n  }, [data.dateLine])`,
        `    // Fallback if formatting differs\r\n    return { day: '18', month: '12', year: '2026' }\r\n  }, [data.dateLine])\r\n\r\n  const groomName = data.groomName || '';\r\n  const brideName = data.brideName || '';\r\n  const groomScale = Math.min(1, 10 / Math.max(1, groomName.length));\r\n  const brideScale = Math.min(1, 10 / Math.max(1, brideName.length));`
      );
      
      // Fallback for LF
      content = content.replace(
        `    // Fallback if formatting differs\n    return { day: '18', month: '12', year: '2026' }\n  }, [data.dateLine])`,
        `    // Fallback if formatting differs\n    return { day: '18', month: '12', year: '2026' }\n  }, [data.dateLine])\n\n  const groomName = data.groomName || '';\n  const brideName = data.brideName || '';\n  const groomScale = Math.min(1, 10 / Math.max(1, groomName.length));\n  const brideScale = Math.min(1, 10 / Math.max(1, brideName.length));`
      );
      changed = true;
    }

    // 2. Groom style
    content = content.replace(
      `        <motion.h1 \r\n          variants={nameContainerVariant}\r\n          className={\`text-[#3D5236] uppercase tracking-[0.06em] select-none font-bold \${\r\n            isDesktop ? 'text-4xl md:text-5xl mb-2' : 'text-2xl sm:text-3xl mb-1.5'\r\n          }\`}\r\n          style={{ fontFamily: "'Cinzel', serif", lineHeight: '1.2' }}\r\n        >\r\n          <span className="block mb-0.5 sm:mb-1 relative" style={{ display: 'block', position: 'relative' }}>`,
      `        <motion.h1 \r\n          variants={nameContainerVariant}\r\n          className={\`text-[#3D5236] uppercase tracking-[0.06em] select-none font-bold \${\r\n            isDesktop ? 'mb-2' : 'mb-1.5'\r\n          }\`}\r\n          style={{ fontFamily: "'Cinzel', serif", lineHeight: '1.2', width: '100%', padding: '0 20px', boxSizing: 'border-box', wordWrap: 'break-word' }}\r\n        >\r\n          <span className="block mb-0.5 sm:mb-1 relative mx-auto" style={{ display: 'block', position: 'relative', fontSize: isDesktop ? \`calc(clamp(36px, 3.5vw, 48px) * \${groomScale})\` : \`calc(clamp(24px, 7vw, 32px) * \${groomScale})\` }}>`
    );
    // LF
    content = content.replace(
      `        <motion.h1 \n          variants={nameContainerVariant}\n          className={\`text-[#3D5236] uppercase tracking-[0.06em] select-none font-bold \${\n            isDesktop ? 'text-4xl md:text-5xl mb-2' : 'text-2xl sm:text-3xl mb-1.5'\n          }\`}\n          style={{ fontFamily: "'Cinzel', serif", lineHeight: '1.2' }}\n        >\n          <span className="block mb-0.5 sm:mb-1 relative" style={{ display: 'block', position: 'relative' }}>`,
      `        <motion.h1 \n          variants={nameContainerVariant}\n          className={\`text-[#3D5236] uppercase tracking-[0.06em] select-none font-bold \${\n            isDesktop ? 'mb-2' : 'mb-1.5'\n          }\`}\n          style={{ fontFamily: "'Cinzel', serif", lineHeight: '1.2', width: '100%', padding: '0 20px', boxSizing: 'border-box', wordWrap: 'break-word' }}\n        >\n          <span className="block mb-0.5 sm:mb-1 relative mx-auto" style={{ display: 'block', position: 'relative', fontSize: isDesktop ? \`calc(clamp(36px, 3.5vw, 48px) * \${groomScale})\` : \`calc(clamp(24px, 7vw, 32px) * \${groomScale})\` }}>`
    );

    // 3. Bride style
    content = content.replace(
      `          <span className="block mt-0.5 sm:mt-1 relative" style={{ display: 'block', position: 'relative' }}>`,
      `          <span className="block mt-0.5 sm:mt-1 relative mx-auto" style={{ display: 'block', position: 'relative', fontSize: isDesktop ? \`calc(clamp(36px, 3.5vw, 48px) * \${brideScale})\` : \`calc(clamp(24px, 7vw, 32px) * \${brideScale})\` }}>`
    );

    // Groom text map
    content = content.replace(/\{\(data\.groomName \|\| ''\)\.split\(''\)/g, `{groomName.split('')`);
    // Bride text map
    content = content.replace(/\{\(data\.brideName \|\| ''\)\.split\(''\)/g, `{brideName.split('')`);
  }

  if (changed || true) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
}

processTemplate('src/pages/TemplateTwilightSerenade.jsx');
