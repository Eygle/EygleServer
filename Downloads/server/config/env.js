/**
 * Created by eygle on 4/29/17.
 */

const path = require('path');

module.exports = {
    env: process.env.NODE_ENV || 'production',

    // Server port
    port: process.env.PORT || 4242,

    // Application database
    db: "EygleDownloads",

    // Root path of server
    root: path.normalize(`${__dirname}/../../`),

    secrets: {
        session: 'eyg*lesec;retpEtit!lapinrose4238'
    },

  // Directory containing all downloaded files
  downloadsDir: "/home/eygle/downloads",

  // File with a JSON representation of the downloadsDir architecture
  dumpFile: path.normalize(`${__dirname}/../../../scripts/list-of-files.json`)
};