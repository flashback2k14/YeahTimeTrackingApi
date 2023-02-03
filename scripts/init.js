const { promises: Fs } = require('node:fs');

async function exists (path) {  
  try {
    await Fs.access(path)
    return true
  } catch {
    return false
  }
}


async function init() {
  const result = await exists('db');
  
  if (result) {
    console.log('db dir already exists');
  } else {
    await Fs.mkdir('db');
    console.log('db dir created');
  }
}

init()
  .catch(err => console.error(err));