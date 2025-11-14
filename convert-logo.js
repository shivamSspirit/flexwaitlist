const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = fs.readFileSync('./public/flexit-logo.svg');

sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile('./public/flexit-logo.png')
  .then(() => {
    console.log('✓ PNG logo created successfully at public/flexit-logo.png (512x512)');
  })
  .catch(err => {
    console.error('Error converting SVG to PNG:', err);
  });
