// Export des frames 3D du RK01 (séquence scroll + rendus fixes) depuis les PNG Blender 1920×1080.
// Usage : node scripts/export-seq.mjs   (sources dans scripts/RK01-angles/, hors git)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "scripts/RK01-angles/RK01 - différents angles";
const OUT = "public/images/product/seq";
const CROP = { left: 94, top: 0, width: 1817, height: 1022 }; // union des bbox alpha sur toutes les frames
const FRAMES = 126; // 1 frame sur 2 des 251 sources
const SHARPEN = { sigma: 0.7, m1: 0.6, m2: 0.2 };
const TIERS = { xl: { width: null, quality: 85 }, lg: { width: 1280, quality: 82 }, sm: { width: 640, quality: 80 } };

const frame = (i) => path.join(SRC, `REKAIRE_TURNOVER_V6_${String(i).padStart(5, "0")}.png`);

for (const tier of Object.keys(TIERS)) fs.mkdirSync(path.join(OUT, tier), { recursive: true });
fs.writeFileSync(path.join(OUT, "crop.json"), JSON.stringify(CROP));

let done = 0;
if (!process.env.STILLS_ONLY) await Promise.all(
  Array.from({ length: 6 }, async (_, w) => {
    for (let i = w; i < FRAMES; i += 6) {
      const base = sharp(frame(i * 2)).extract(CROP);
      for (const [tier, { width, quality }] of Object.entries(TIERS)) {
        let img = base.clone();
        if (width) img = img.resize(width);
        await img.sharpen(SHARPEN).webp({ quality, alphaQuality: 90, effort: 6 }).toFile(path.join(OUT, tier, `${String(i).padStart(3, "0")}.webp`));
      }
      if (++done % 20 === 0) console.log(`${done}/${FRAMES}`);
    }
  }),
);

// Rendus fixes (galerie produit + cartes de la home), cadrés 4:3 autour du produit, résolution native
const stills = [
  { name: "rk01-angle-3-4", src: 0 },
  { name: "rk01-angle-rapproche", src: 104 },
  { name: "rk01-angle-dessous", src: 48 },
  { name: "rk01-vue-eclatee", src: 250 },
];
fs.mkdirSync("public/images/product/angles", { recursive: true });
for (const s of stills) {
  let img = sharp(frame(s.src));
  if (s.zoom) img = img.extract(s.zoom);
  else {
    const { data, info } = await img.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let minx = 1e9, miny = 1e9, maxx = 0, maxy = 0;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 8) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
    const pad = 0.06;
    let w = (maxx - minx) * (1 + 2 * pad), h = (maxy - miny) * (1 + 2 * pad);
    if (w / h > 4 / 3) h = (w * 3) / 4; else w = (h * 4) / 3;
    const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
    const left = Math.max(0, Math.round(cx - w / 2)), top = Math.max(0, Math.round(cy - h / 2));
    img = img.extract({ left, top, width: Math.min(info.width - left, Math.round(w)), height: Math.min(info.height - top, Math.round(h)) });
  }
  await img.sharpen(SHARPEN).webp({ quality: 88, alphaQuality: 92, effort: 6 }).toFile(`public/images/product/angles/${s.name}.webp`);
  console.log("still", s.name);
}
