const fs = require("fs");
const JSZip = require("jszip");
const path = require('path');


// We assume that validate has already been called on our targetDir
module.exports = async ({targetDir, outputDir}) => {
  const treehubPath = path.join(targetDir, 'treehub.json');
  const treehub = require(treehubPath);
  const outputPath = path.join(outputDir, `${treehub.name}.zip`);

  const zip = new JSZip();

  zip.file('treehub.json',
    fs.readFileSync(treehubPath));
  zip.file('README.md',
    fs.readFileSync(path.join(targetDir, 'README.md')));

  if (treehub.route) {
    zip.file(treehub.route,
      fs.readFileSync(path.join(targetDir, treehub.route)));
  }

  if (treehub.components) {
    for (const component of treehub.components) {
      zip.file(component,
        fs.readFileSync(path.join(targetDir, component)));
    }
  }

  await writeZip(zip, outputPath);
}

function writeZip(zip, file) {
  return new Promise((resolve, reject) => {
    zip
      .generateNodeStream({type:'nodebuffer', streamFiles:true})
      .pipe(fs.createWriteStream(file))
      .on('finish', function () {
        resolve();
      });
  });
}
