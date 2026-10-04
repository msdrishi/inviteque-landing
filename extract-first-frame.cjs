/**
 * Extract the first frame of the PinkBlossom envelope video as a WebP image.
 * Usage: node extract-first-frame.cjs
 */
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Resolve ffmpeg binary from ffmpeg-static
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (e) {
  console.error('ffmpeg-static not found. Run: npm install --save-dev ffmpeg-static');
  process.exit(1);
}

const videoPath = path.resolve(__dirname, 'public/assets/templates/pinkblossom/PinkBlossom-envelope.mp4');
const outputPath = path.resolve(__dirname, 'public/assets/templates/pinkblossom/PinkBlossom-envelope-poster.webp');

if (!fs.existsSync(videoPath)) {
  console.error('Video file not found:', videoPath);
  process.exit(1);
}

console.log('Extracting first frame from:', videoPath);
console.log('Output:', outputPath);

try {
  execFileSync(ffmpegPath, [
    '-i', videoPath,
    '-vframes', '1',
    '-q:v', '2',
    '-y',
    outputPath
  ], { stdio: 'inherit' });
  
  const stats = fs.statSync(outputPath);
  console.log(`\nDone! First frame saved (${(stats.size / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Failed to extract frame:', err.message);
  process.exit(1);
}
