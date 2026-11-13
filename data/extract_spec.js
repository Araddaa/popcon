const fs = require('fs');
const content = fs.readFileSync('c:/Users/user/Documents/네이트온 받은 파일/팝콘 화면 목업 v1.6.html', 'utf8');

const regex = /add\(\{\s*part:\s*'([^']*)',\s*name:\s*'([^']*)',\s*url:\s*'([^']*)',\s*role:\s*'([^']*)',\s*kind:\s*'([^']*)'[\s\S]*?feats:\s*(\[[^\]]*\])/g;

let m;
const screens = [];
let idx = 0;

// Or simpler: find each add({ ... }) block
const addBlocks = content.split('add({');
addBlocks.shift(); // remove before first add({

for (const block of addBlocks) {
  const partMatch = block.match(/part:\s*'([^']*)'/);
  const nameMatch = block.match(/name:\s*'([^']*)'/);
  const urlMatch = block.match(/url:\s*'([^']*)'/);
  const roleMatch = block.match(/role:\s*'([^']*)'/);
  const kindMatch = block.match(/kind:\s*'([^']*)'/);
  const noteMatch = block.match(/note:\s*'([^']*)'/);
  
  // feats
  const feats = [];
  const featMatch = block.match(/feats:\s*\[([\s\S]*?)\]/);
  if (featMatch) {
    const fBlock = featMatch[1];
    const pairRegex = /\['([^']*)',\s*'([^']*)'\]/g;
    let pm;
    while ((pm = pairRegex.exec(fBlock)) !== null) {
      feats.push([pm[1], pm[2]]);
    }
  }

  if (nameMatch && urlMatch) {
    screens.push({
      no: String(idx).padStart(2, '0'),
      part: partMatch ? partMatch[1] : '0',
      name: nameMatch[1],
      url: urlMatch[1],
      role: roleMatch ? roleMatch[1] : '전체',
      kind: kindMatch ? kindMatch[1] : 'core',
      feats: feats,
      note: noteMatch ? noteMatch[1] : ''
    });
    idx++;
  }
}

fs.writeFileSync('C:/Users/user/.gemini/antigravity/scratch/popspot/data/specScreens.json', JSON.stringify(screens, null, 2), 'utf8');
console.log(`Extracted ${screens.length} screens from v1.6 specification!`);
