const { promises: fs } = require('node:fs');

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function init() {
  const result = await exists('db');

  if (result) {
    console.log('db dir already exists');
  } else {
    await fs.mkdir('db');
    console.log('db dir created');
  }
}

init().catch((err) => console.error(err));
