#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function generate(folder) {
  const dir = path.resolve(process.cwd(), folder);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter(e => e.isFile())
      .filter(e => e.name !== 'files.json')
      .map(e => ({ name: e.name, url: `${folder}/${e.name}` }));

    const out = JSON.stringify(files, null, 2) + '\n';
    await fs.writeFile(path.join(dir, 'files.json'), out, 'utf8');
    console.log(`Wrote ${files.length} items to ${path.join(folder, 'files.json')}`);
  } catch (err) {
    console.error(`Error processing ${folder}: ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const folders = args.length ? args : ['Data'];
  for (const f of folders) {
    await generate(f);
  }
}

main();
