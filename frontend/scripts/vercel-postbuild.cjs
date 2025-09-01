const fs = require('fs');
const path = require('path');

function log(msg){ console.log('[postbuild]', msg); }

const outDir = path.join(process.cwd(), 'out');
const pubDir = path.join(process.cwd(), 'public');

try {
  // Toujours s'assurer que public/ existe
  if (!fs.existsSync(pubDir)) {
    fs.mkdirSync(pubDir, { recursive: true });
    log('created public/');
  }

  if (fs.existsSync(outDir)) {
    // Nettoyer public/ avant copie
    for (const entry of fs.readdirSync(pubDir)) {
      fs.rmSync(path.join(pubDir, entry), { recursive: true, force: true });
    }
    // Copier out/ -> public/
    fs.cpSync(outDir, pubDir, { recursive: true });
    log('copied out/ -> public/');
  } else {
    log('warning: out/ not found after next build (nothing to copy).');
  }
} catch (e) {
  console.error('[postbuild] ERROR:', e);
  process.exit(1);
}