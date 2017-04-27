/**
 * Created by eygle on 4/27/17.
 */

const saveFiles = __dirname + "/list-of-files.json";
const fs = require("fs");
let files = require("../server/modules/listDirectory")("/home/eygle/downnloads");

// if (files) {
    let oldFiles;
    if (fs.existsSync(saveFiles)) {
        const oldFilesTxt = fs.readFileSync(saveFiles);
        oldFiles = oldFilesTxt ? Json.parse(oldFilesTxt) : [];
    } else {
        oldFiles = oldFilesTxt ? Json.parse(oldFilesTxt) : [];
    }

    for (let f of loadFileList2Process(files, oldFiles)) {
        // TODO process file
    }

    fs.writeFileSync(saveFiles, JSON.stringify(files));
// }

const loadFileList2Process = (files, oldFiles) => {
    return oldFiles; // TODO RM
};