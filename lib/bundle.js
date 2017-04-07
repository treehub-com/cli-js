const fs = require("fs");
const JSZip = require("jszip");
const path = require('path');


// We assume that validate has already been called on our targetDir
async function create({dir}) {
  const treehub = require(path.join(dir, 'treehub.json'));
  const zip = new JSZip();

  zip.file('treehub.json',
    fs.readFileSync(path.join(dir, 'treehub.json')));
  zip.file('README.md',
    fs.readFileSync(path.join(dir, 'README.md')));

  if (treehub.route) {
    zip.file(treehub.route,
      fs.readFileSync(path.join(dir, treehub.route)));
  }

  if (treehub.components) {
    for (const component of treehub.components) {
      zip.file(component,
        fs.readFileSync(path.join(dir, component)));
    }
  }
  return {
    name: treehub.name,
    zip
  };
}

async function write({zip, file}) {
  return new Promise((resolve, reject) => {
    zip
      .generateNodeStream({type:'nodebuffer'})
      .pipe(fs.createWriteStream(file))
      .on('finish', function () {
        resolve();
      });
  });
}

module.exports = {
  create,
  write,
}
