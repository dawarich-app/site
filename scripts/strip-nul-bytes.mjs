import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

export function stripNulBytes(buildDir) {
  const fixed = [];
  for (const file of htmlFiles(buildDir)) {
    const data = fs.readFileSync(file);
    const count = data.reduce((n, byte) => n + (byte === 0 ? 1 : 0), 0);
    if (count === 0) continue;
    fs.writeFileSync(file, data.filter((byte) => byte !== 0));
    fixed.push({ file: path.relative(buildDir, file), count });
  }
  return fixed;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const fixed = stripNulBytes(path.resolve(process.argv[2] ?? 'build'));
  console.log(`strip-nul-bytes: cleaned ${fixed.length} HTML file(s)`);
}
