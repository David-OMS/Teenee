import path from "path";
import sharp from "sharp";

const iconsDir = path.join(process.cwd(), "public", "icons");
const source = path.join(iconsDir, "icon-512.png");

async function generatePwaIcons() {
  await sharp(source).resize(192, 192).toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(source).resize(180, 180).toFile(path.join(iconsDir, "apple-touch-icon.png"));
  console.log("PWA icons generated in public/icons/");
}

void generatePwaIcons();
