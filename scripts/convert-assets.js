import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/templates/Indian Reverie');
const outputDir = path.join(__dirname, '../public/assets/templates/kirti-and-sahil');

async function convertAssets() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    
    const files = await fs.readdir(inputDir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, path.extname(file));
      const inputPath = path.join(inputDir, file);
      
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const outputPath = path.join(outputDir, `${name}.webp`);
        console.log(`Converting ${file} to ${name}.webp...`);
        
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Converted: ${outputPath}`);
      } else if (ext === '.mp4') {
        const outputPath = path.join(outputDir, file);
        console.log(`Copying video ${file}...`);
        await fs.copyFile(inputPath, outputPath);
      }
    }
    
    console.log('Done converting assets.');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

convertAssets();
