/* eslint-disable */
const fs = require("fs");
module.exports = async function (globalConfig, projectConfig) {
  for (const dir of globalThis.movedFiles) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};
