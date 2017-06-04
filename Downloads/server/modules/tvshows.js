/**
 * Created by eygle on 5/26/17.
 */

const q = require('q')
  , _ = require('underscore')
  , TVDB = require('node-tvdb')
  , db = require('../../server/modules/db')
  , config = require('../../server/config/env')
  , tvdb = new TVDB(config.secrets.TVDB);

// const minInterval = ;

let lastRequest = 0;

module.exports = {
  searchByTitle: (title) => {
    return tvdb.getSeriesByName(title, {lang: 'fr'});
  },

  fetchTVShow: (tvdbId) => {
    const defer = q.defer();

    const show = {};

    q.allSettled([
      tvdb.getSeriesAllById(tvdbId, {lang: 'fr'})
        .then(res => _.map(res, (v, k) => {
          show[k] = v;
        })),
      tvdb.getSeriesPosters(tvdbId).then(res => show.posters = res),
      tvdb.getActors(tvdbId, {lang: 'fr'}).then(res => show.actors = res)
    ]).then(() => {
      defer.resolve(show);
    }).catch(() => {
      defer.reject();
    });

    return defer.promise;
  },

  createOrUpdateTVShowFromTVDBResult: (t) => {
    const defer = q.defer();
    db.models.TVShow.findOne({tvdbId: t.id})
      .exec((err, item) => {
        let create = false;
        if (err || !item) {
          item = {};
          create = true;
        }

        if (create) {
          item.title = t.seriesName;
          item.tvdbId = t.id;
          item.imdbId = t.imdbId;
          item.genres = t.genre;
          item.overview = t.overview;
          item.start = t.firstAired ? new Date(t.firstAired) : null;
          item.network = t.network;
        }

        item.banner = `http://thetvdb.com/banners/${t.banner}`;
        item.poster = t.posters ? `http://thetvdb.com/banners/${t.posters[0].fileName}` : null;
        item.posterThumb = t.posters ? `http://thetvdb.com/banners/${t.posters[0].thumbnail}` : null;
        item.actors = _.map(
          _.sortBy(t.actors, (s) => {
            return s.sortOrder
          }),
          (v) => {
            return {
              tvdbId: v.id,
              name: v.name,
              character: v.role,
              image: v.image ? `http://thetvdb.com/banners/${v.image}` : null
            }
          });

        item.runtime = parseInt(t.runtime);
        item.status = t.status;

        defer.resolve(create ? new db.models.TVShow(item) : item);
      });
    return defer.promise;
  },

  createOrUpdateEpisodeFromTVDBResult: (show, res, files) => {
    const defer = q.defer();

    db.models.Episode.findOne({tvdbId: res.id})
      .exec((err, item) => {
        if (err || !item) {
          const ep = new db.models.Episode({
            title: res.episodeName,
            tvdbId: res.id,
            _tvShow: show._id,
            _files: _.map(files, (f) => {
              return f._id
            }),
            number: res.airedEpisodeNumber,
            season: res.airedSeason,
            overview: res.overview,
            date: res.firstAired
          });
          for (let file of files) {
            file._episode = ep._id;
          }
          return defer.resolve(ep);
        }

        item._files = item._files.concat(_.map(files, (f) => {
          return f._id
        }));
        for (let file of files) {
          file._episode = item._id;
        }
        defer.resolve(item);
      });
    return defer.promise;
  }
};