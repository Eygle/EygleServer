/**
 * Created by eygle on 5/6/17.
 */

const q = require("q")
  , util = require('util')
  , TVShows = require('../../server/modules/tvshows');

let total = 0;
let processed = 0;

module.exports.processAll = (files) => {
  const defer = q.defer();

  processListSequentially(createTVShowList(files), () => {
    defer.resolve();
  });

  return defer.promise();
};

const processListSequentially = (list, callback) => {
  for (let show in list) {
    if (list.hasOwnProperty(show)) {
      processTVShow(show, list[show], () => {
        delete list[show];
        processed++;
        processListSequentially(list);
      });
      return;
    }
  }
  callback();
};

const processTVShow = (title, seasons, callback) => {
  console.log(`Process [${processed + 1}/${total}]: ${title}`);
  TVShows.searchByTitle(title)
    .then(res => {
      if (res.length === 1) {
        // insert unique TVShow & all episodes
        console.log('  TVShow found in TVDB. Fetching all info...');
        TVShows.fetchTVShow(res[0].id)
          .then(res => {
            TVShows.createOrUpdateTVShowFromTVDBResult(res).then(show => {
              show.save(err => {
                if (err) {
                  console.log('  An error occurred while creating TVShow in mongo');
                  console.error(err);
                  return callback();
                } else {
                  console.log('  Added/updated TVShow')
                }

                addAllEpisodes(show, res.episodes, seasons).then(() => {
                  callback();
                });
              });
            });
          })
          .catch(() => {
            console.error(`  Impossible to fetch TVShow id:${res[0].id} from TVDB`);
            callback();
          });
      } else if (res.length > 1) {
        console.log('  Multiple results found');
        callback();
      } else {
        console.log('  No result found in TVDB');
        callback();
      }
    })
    .catch(() => {
      console.log('  TVDB error');
      callback();
    })
};

const createTVShowList = (files) => {
  const tvshows = {};

  for (let f of files) {
    const title = f.info.title.toLowerCase();
    if (!tvshows.hasOwnProperty(title)) {
      tvshows[title] = {};
      total++;
    }
    if (!tvshows[title].hasOwnProperty(f.info.season))
      tvshows[title][f.info.season] = {};
    if (!tvshows[title][f.info.season].hasOwnProperty(f.info.episode))
      tvshows[title][f.info.season][f.info.episode] = [f.File];
    else
      tvshows[title][f.info.season][f.info.episode].push(f.File);
  }

  return tvshows;
};

const addAllEpisodes = (show, episodesList, localFilesPerSeasons) => {
  const defer = q.defer();
  const promises = [];

  for (let season in localFilesPerSeasons) {
    if (localFilesPerSeasons.hasOwnProperty(season)) {
      for (episode in localFilesPerSeasons[season]) {
        if (localFilesPerSeasons[season].hasOwnProperty(episode)) {
          const res = findEpisodeFromList(episodesList, parseInt(season), parseInt(episode));
          if (res) {
            const d = q.defer();
            promises.push(d.promise);

            TVShows.createOrUpdateEpisodeFromTVDBResult(show, res, localFilesPerSeasons[season][episode])
              .then(episode => {
                const dEpisode = q.defer();
                const p = [dEpisode.promise];

                episode.save(err => {
                  if (err)
                    console.log(`  Error while saving S${episode.season}E${episode.number}`);
                  else
                    console.log(`  Added S${episode.season}E${episode.number}`);
                  dEpisode.resolve();
                });

                for (let f of localFilesPerSeasons[episode.season][episode.number]) {
                  const dFile = q.defer();
                  p.push(dFile.promise);
                  f.save(err => {
                    if (err)
                      console.log(`  Error while saving file ${f.filename}`);
                    dFile.resolve();
                  });
                }

                q.allSettled(p).then(() => d.resolve()).catch(() => d.resolve());
              });
          } else {
            console.log(`  Error: S${season}E${episode} not found in TVDB episodes list`);
          }
        }
      }
    }
  }

  q.allSettled(promises).then(() => defer.resolve());

  return defer.promise;
};

const findEpisodeFromList = (list, s, e) => {
  for (let v of list) {
    if (v.airedSeason === s && v.airedEpisodeNumber === e) {
      return v;
    }
  }
  return null;
};