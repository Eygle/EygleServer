/**
 * Created by eygle on 5/12/17.
 */

const ptn = require('parse-torrent-name');

for (let f of "Gossip.Girl.iNTEGRALE.FRENCH.WEBRip.x264.SD-QC/Gossip.Girl.S05.FRENCH.WEBRip.x264.SD-QC/Gossip Girl S5 EP13.mp4".split('/')) {
  console.log(f, ptn(f))
}