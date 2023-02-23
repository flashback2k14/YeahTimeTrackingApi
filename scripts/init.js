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
  const dirs = ['db', 'static'];

  for (const dir of dirs) {
    const result = await exists(dir);

    if (result) {
      console.log(`Directory ${dir} already exists`);
    } else {
      await fs.mkdir(dir);
      console.log(`Directory ${dir} created`);
    }
  }
}

init().catch((err) => console.error(err));
