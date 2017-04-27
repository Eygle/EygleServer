/**
 * Created by eygle on 4/27/17.
 */

const saveFiles = "./list-of-files.json";
const fs = require("fs");
const files = require("../server/modules/listDirectory")(".");
const oldFilesTxt = fs.readFileSync(saveFiles);
const oldFiles = oldFilesTxt ? Json.parse(oldFilesTxt) : [];

fs.writeFileSync(saveFiles, JSON.stringify(files));