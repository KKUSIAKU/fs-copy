
const path = require('path');
const fs = require('fs')

/*
* TODO:
* support: empty dir skip
* support: absolute path : either both dir are relative or absolute but not a mix
* file attribute preservation or modification should be handle with flexibily
*/
module.exports = async function fsCopy(source, destination) {

  if(!fs.existsSync(source)) {
    throw TypeError('Source directory path is invalid or doest not exists')
  }

  if(fs.existsSync(destination)) {
    throw TypeError('Destinatiion directory exists already')
  }

  // source is relative;
  async  function walk(source, destination) {
    await fs.mkdirSync(destination)
    let sourceDir = fs.opendirSync(source)
    let sourcePath = '';

    for await(const dirent of sourceDir) {
      sourcePath = path.join(sourceDir.path, dirent.name);
      if (dirent.isFile()) {
        let sourcefilePath = path.join(source, dirent.name)
        let destinationfilePath = path.join(destination, dirent.name)
        fs.copyFileSync(sourcefilePath, destinationfilePath)
      } else if( dirent.isDirectory()) {
        let newSource = path.join(sourceDir.path, dirent.name)
        let newDestiantion = path.join(destination, dirent.name)
        walk(newSource, newDestiantion)
      }
    }
  }

  walk(source, destination)
}