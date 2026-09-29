#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");

async function getPictures(folder) {
  const dir = path.resolve(process.cwd(), folder);
  const locations = await fs.readdir(dir, { withFileTypes: true });

  const files = [];

  for (const location of locations) {
    if (!location.isDirectory()) continue;

    const locationPath = path.join(dir, location.name);
    const entries = await fs.readdir(locationPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      files.push({
        name: entry.name,
        url: `${folder}/${location.name}/${entry.name}`,
        location: location.name
      });
    }
  }

  await fs.writeFile(
    path.join(dir, "files.json"),
    JSON.stringify(files, null, 2) + "\n",
    "utf8"
  );

  console.log(`Wrote ${files.length} pictures to ${folder}/files.json`);
}

async function generate(folder) {
  const dir = path.resolve(process.cwd(), folder);
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = entries
    .filter(entry => entry.isFile() && entry.name !== "files.json")
    .map(entry => ({ name: entry.name, url: `${folder}/${entry.name}` }));

  await fs.writeFile(
    path.join(dir, "files.json"),
    JSON.stringify(files, null, 2) + "\n",
    "utf8"
  );
}

async function main() {
  await generate("Data");
  await generate("Documents");
  await getPictures("Pictures");
}

main().catch(console.error);