import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = 'e:/Wedding-Website/wedding-invite/src/templates/Indian Reverie';

async function convert() {
  const files = await fs.readdir(dir);
  for (const file of files) {
    if (file.toLowerCase().endsWith('.png')) {
      const fullPath = path.join(dir, file);
      const outPath = path.join(dir, file.replace(/\.png$/i, '.webp'));
      console.log(`Converting ${file} to ${path.basename(outPath)}`);
      await sharp(fullPath).webp({ lossless: true }).toFile(outPath);
      // Remove original
      await fs.unlink(fullPath);
    }
  }
}

convert().catch(console.error);
