const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "assets");

const copyClean = (subDir, prefix) => {
  const dir = path.join(baseDir, subDir);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  let idx = 1;
  files.forEach(file => {
    if ((file.endsWith(".jpeg") || file.endsWith(".jpg") || file.endsWith(".png")) && !file.startsWith(prefix + "_")) {
      const ext = path.extname(file);
      const cleanName = `${prefix}_${idx}${ext}`;
      const src = path.join(dir, file);
      const dest = path.join(dir, cleanName);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${file} -> ${cleanName}`);
      }
      idx++;
    }
  });
};

copyClean("mazen", "mazen");
copyClean("moaz", "moaz");
copyClean("elhagan", "elhagan");
copyClean("turkey", "turkey");
copyClean("europe", "europe");
copyClean("k3abdayr", "logo");
copyClean("social", "proof");

console.log("Assets processed successfully.");
