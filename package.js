/* eslint-disable */
const fs = require("fs");
const path = require("path");

let json = null;

const getPackageJson = (refresh = false) => {
  if (json && !refresh) return json;

  json = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./package.json"), {
      encoding: "utf-8",
    }),
  );
  return json;
};
module.exports = { getPackageJson };
