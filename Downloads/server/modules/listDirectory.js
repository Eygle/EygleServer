/**
 * Created by eygle on 4/27/17.
 */
const fs = require("fs");
const path = require("path");

const listDirectory = (dir, parent = null) => {
    const files = fs.readdirSync(dir);
    const list = [];

    for (let f of files) {
        const filename = path.join(dir, f);
        const stats = fs.statSync(filename);
        const file = {
            filename: f,
            isDirectory: stats.isDirectory(),
            parent: parent
        };
        if (stats.isDirectory()) {
            file.children = listDirectory(filename, f);
        } else {
            file.extname = path.extname(f);
            file.size = stats.size;
        }
        list.push(file);
    }

    return list;
};

module.exports = (dir) => {
    if (fs.existsSync(dir)) {
        const stats = fs.statSync(dir);
        if (stats.isDirectory()) {
            return listDirectory(dir);
        } else {
            return false;
        }
    } else {
        return false;
    }
};