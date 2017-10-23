import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';
import TMDB, {ITMDBMovie} from "../modules/TMDB";

const _schema: mongoose.Schema = DB.createSchema({
    title: String,
    originalTitle: String,
    date: Date,
    countries: [{type: String}],
    genres: [{type: String}],
    overview: String,
    budget: Number,
    revenue: Number,
    originalLanguage: String,
    runtime: Number,

    poster: String,
    posterThumb: String,
    backdrop: String,

    cast: [{
        tmdbId: Number,
        name: String,
        character: String,
        image: String
    }],
    crew: [{
        tvdbId: Number,
        name: String,
        job: String,
        image: String,
    }],

    videos: [{
        id: String,
        lang: String,
        key: String,
        name: String,
        site: String,
        size: Number,
        videoType: String
    }],

    tmdbId: Number,

    files: [{type: String, ref: 'File'}]
});

export class Movie extends ASchema {
    /**
     * Find one by tmdbId
     * @param {number} tmdbId
     */
    public findOneByTMDBId(tmdbId: number) {
        const defer = q.defer();

        this._model.findOne()
            .where('tmdbId', tmdbId)
            .exec((err, item) => {
                if (err) return defer.reject(err);
                defer.resolve(item);
            });

        return defer.promise;
    }

    public findWithFileId(fid) {
        const defer = q.defer();

        this._model.find()
            .where('files').in([fid])
            .populate('files')
            .exec((err, item) => {
                if (err) return defer.reject(err);
                defer.resolve(item);
            });

        return defer.promise;
    }

    /**
     * Create movie from TMDB result
     * @param {ITMDBMovie} m
     * @param {IFile} file
     * @returns {IMovie}
     */
    public createFromTMDB(m: ITMDBMovie, file: IFile = null) {
        const movie: IMovie = <IMovie>this.add({
            title: m.title,
            originalTitle: m.original_title,
            date: m.release_date ? new Date(m.release_date) : null,
            genres: _.map(m.genres, (v) => {
                return v.name;
            }),
            overview: m.overview,
            runtime: m.runtime,
            voteCount: m.vote_count,
            voteAverage: m.vote_average,
            budget: m.budget,
            revenue: m.revenue,
            posterThumb: m.poster_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('p', 154) + m.poster_path : null,
            poster: m.poster_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('p', 1000) + m.poster_path : null,
            backdrop: m.backdrop_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('b', 2000) + m.backdrop_path : null,
            originalLanguage: m.original_language,
            countries: _.map(m.production_countries, (v) => {
                return v.iso_3166_1;
            }),

            cast: _.map(_.filter(m.credits.cast, (v) => {
                return v.order <= 15
            }), (v) => {
                return {
                    tmdbId: v.id,
                    name: v.name,
                    character: v.character,
                    image: v.profile_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('c', 138) + v.profile_path : null
                }
            }),
            crew: _.map(_.filter(m.credits.crew, (v) => {
                return v.department === 'Directing' || v.department === 'Production';
            }), (v) => {
                return {
                    tmdbId: v.id,
                    name: v.name,
                    job: v.job,
                    image: v.profile_path ? TMDB.config.images.base_url + TMDB.getSizeCloseTo('c', 138) + v.profile_path : null
                }
            }),

            videos: _.map(m.videos.results, (v) => {
                return {
                    id: v.id,
                    lang: v.iso_639_1,
                    key: v.key,
                    name: v.name,
                    site: v.site ? v.site.toLowerCase() : null,
                    size: v.size,
                    videoType: v.type
                }
            }),

            tmdbId: m.id,
            imdbId: m.imdb_id,
        });

        if (file) {
            file.movie = movie._id;
            movie.files = [file._id];
        }

        return movie;
    }

    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema(): mongoose.Schema {
        return _schema;
    }
}

const instance = new Movie();

module.exports.schema = instance;
export default instance;