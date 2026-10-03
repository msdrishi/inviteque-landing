const fs = require('fs');

let content = fs.readFileSync('src/pages/TemplateModernHearth.jsx', 'utf8');

// Chunk 1
content = content.replace(
  `      hero: {
        functionTitle,
        hostName,
        houseName,
        dateLine: dateStr,
        weddingTime: timeStr,`,
  `      hero: {
        functionTitle,
        hostName,
        houseName,
        functionTitleScale: Math.min(1, 15 / Math.max(1, functionTitle.length)),
        houseNameScale: Math.min(1, 15 / Math.max(1, houseName.length)),
        dateLine: dateStr,
        weddingTime: timeStr,`
);

// Fallback LF
content = content.replace(
  `      hero: {\n        functionTitle,\n        hostName,\n        houseName,\n        dateLine: dateStr,\n        weddingTime: timeStr,`,
  `      hero: {\n        functionTitle,\n        hostName,\n        houseName,\n        functionTitleScale: Math.min(1, 15 / Math.max(1, functionTitle.length)),\n        houseNameScale: Math.min(1, 15 / Math.max(1, houseName.length)),\n        dateLine: dateStr,\n        weddingTime: timeStr,`
);


// Chunk 2
const old2 = `<motion.h1 variants={itemVariants} className="text-[#6B351D] select-none leading-[1.1] w-[85%] mb-0.5 text-[38px] sm:text-6xl md:text-[72px] font-bold font-heading" style={{ fontFamily: "'Priestacy', serif" }}>
              {data.hero.functionTitle || 'House Warming'}
            </motion.h1>`;
const new2 = `<motion.h1 variants={itemVariants} className="text-[#6B351D] select-none leading-[1.1] w-full px-5 box-border break-words mb-0.5 font-bold font-heading mx-auto" style={{ 
              fontFamily: "'Priestacy', serif", 
              fontSize: \`calc(clamp(38px, 10vw, 72px) * \${data.hero.functionTitleScale || 1})\`
            }}>
              {data.hero.functionTitle || 'House Warming'}
            </motion.h1>`;
content = content.replace(old2, new2);
content = content.replace(old2.replace(/\n/g, '\r\n'), new2.replace(/\n/g, '\r\n'));

// Chunk 3
const old3 = `<motion.p variants={itemVariants} className="text-[18px] sm:text-[28px] md:text-[40px] text-[#B77A16] font-bold select-none leading-none mb-1 font-heading !mt-8 md:!mt-14" style={{ fontFamily: "'PrimorStylish', serif" }}>
              {data.hero.houseName || 'Karthik Nest'}
            </motion.p>`;
const new3 = `<motion.p variants={itemVariants} className="text-[#B77A16] font-bold select-none leading-none mb-1 font-heading !mt-8 md:!mt-14 w-full px-5 box-border break-words mx-auto" style={{ 
              fontFamily: "'PrimorStylish', serif",
              fontSize: \`calc(clamp(18px, 6vw, 40px) * \${data.hero.houseNameScale || 1})\`
            }}>
              {data.hero.houseName || 'Karthik Nest'}
            </motion.p>`;
content = content.replace(old3, new3);
content = content.replace(old3.replace(/\n/g, '\r\n'), new3.replace(/\n/g, '\r\n'));

// Chunk 4
const old4 = `<motion.h1 variants={itemVariants} className="text-[3.8vw] xl:text-[3.2vw] text-[#6B351D] font-bold my-1 drop-shadow-sm select-none leading-none font-heading" style={{ fontFamily: "'Priestacy', serif" }}>
              {data.hero.functionTitle || 'House Warming'}
            </motion.h1>`;
const new4 = `<motion.h1 variants={itemVariants} className="text-[#6B351D] font-bold my-1 drop-shadow-sm select-none leading-none font-heading w-full px-5 box-border break-words mx-auto" style={{ 
              fontFamily: "'Priestacy', serif",
              fontSize: \`calc(clamp(3.2vw, 3.8vw, 4vw) * \${data.hero.functionTitleScale || 1})\`
            }}>
              {data.hero.functionTitle || 'House Warming'}
            </motion.h1>`;
content = content.replace(old4, new4);
content = content.replace(old4.replace(/\n/g, '\r\n'), new4.replace(/\n/g, '\r\n'));

// Chunk 5
const old5 = `<motion.p variants={itemVariants} className="text-[2.6vw] xl:text-[2.2vw] text-[#B77A16] font-bold mb-2 drop-shadow-sm select-none leading-none font-heading" style={{ fontFamily: "'PrimorStylish', serif", marginTop: '64px' }}>
              {data.hero.houseName || 'Karthik Nest'}
            </motion.p>`;
const new5 = `<motion.p variants={itemVariants} className="text-[#B77A16] font-bold mb-2 drop-shadow-sm select-none leading-none font-heading w-full px-5 box-border break-words mx-auto" style={{ 
              fontFamily: "'PrimorStylish', serif", marginTop: '64px',
              fontSize: \`calc(clamp(2.2vw, 2.6vw, 3vw) * \${data.hero.houseNameScale || 1})\`
            }}>
              {data.hero.houseName || 'Karthik Nest'}
            </motion.p>`;
content = content.replace(old5, new5);
content = content.replace(old5.replace(/\n/g, '\r\n'), new5.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/pages/TemplateModernHearth.jsx', content);
console.log('done');
