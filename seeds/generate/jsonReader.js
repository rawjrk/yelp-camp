const fs = require('fs');

module.exports.readJsonFile = path => {
  const rawdata = fs.readFileSync(path);
  const obj = JSON.parse(rawdata);
  return obj;
};

module.exports.writeJsonFile = (obj, path) => {
  const rawdata = JSON.stringify(obj, null, 2);
  fs.writeFileSync(path, rawdata);
};
