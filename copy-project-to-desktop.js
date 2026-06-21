const fs = require('fs');
const path = require('path');
const src = path.resolve(__dirname);
const dest = path.join(process.env.USERPROFILE, 'OneDrive', 'Desktop', 'smart-invoice-gst-generator');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(src, dest);
console.log('COPIED', dest);
