/* eslint-disable */
const fs = require("fs");
const path = require("path");

const movedFiles = [];
function moveMocks(_path = "", count = 0) {
  for (const str of fs.readdirSync(_path)) {
    if (_path.endsWith("__mocks__") && count != 0) {
      const copyDest = _path.replace("__mocks__/", "");
      // move
      fs.cpSync(_path, copyDest, { recursive: true });
      movedFiles.push(copyDest);
      continue;
    }
    const dirPath = path.resolve(_path, str);
    if (fs.lstatSync(dirPath).isDirectory()) {
      moveMocks(dirPath, count + 1);
    }
  }
}

module.exports = async function (globalConfig, projectConfig) {
  moveMocks(path.resolve(__dirname, "__mocks__"));
  globalThis.movedFiles = movedFiles;
};
