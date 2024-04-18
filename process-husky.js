/* eslint-disable */

const { getPackageJson } = require("./package");
const fs = require("fs");
const path = require("path");

const list = Object.entries(getPackageJson().husky.hooks);
for (const obj of list) {
  fs.writeFileSync(path.resolve(__dirname, `./.husky/${obj[0]}`), obj[1]);
}
