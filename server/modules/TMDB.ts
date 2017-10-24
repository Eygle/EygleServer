import * as q from "q"
import * as _ from "underscore"
import * as moviedb from "moviedb"

import Utils from "../config/Utils";
import Movie from "../schemas/Movie.schema";
import EdError from "../config/EdError";
import {EHTTPStatus} from "../typings/enums";

const MovieDB = moviedb(Utils.tmdbToken);

class TMDB {

    /**
     * Config object
     */
    public config: { images: { base_url: { base_url: string } } };

    /**
     * Initialize lib
     */
    public init() {
        MovieDB.configuration((err, res) => {
            this.config = res;
        });
    }

    public get(tmdbId: number, file = null) {
        const defer = q.defer();

        // Check if we already have a movie with this tmdbId
        Movie.findOneByTMDBId(tmdbId)
            .then((movie: IMovie) => {
                if (!movie) {
                    // Create a new movie with all info
                    MovieDB.movieInfo({
                        id: tmdbId,
                        language: 'fr',
                        append_to_response: 'credits,videos'
                    }, (err, res) => {
                        if (err || !res) {
                            defer.reject(err || new EdError(EHTTPStatus.BadRequest));
                        } else {
                            defer.resolve(Movie.createFromTMDB(res, file));
                        }
                    });
                } else {
                    file._movie = movie._id;
                    if (movie.files) {
                        if (movie.files.indexOf(file._id) === -1)
                            movie.files.push(file._id);
                    } else {
                        movie.files = [file._id];
                    }
                    defer.resolve(movie);
                }
            })
            .catch(defer.reject);

        return defer.promise;
    }

    public searchByTitle(title) {
        const defer = q.defer();

        MovieDB.searchMovie({query: title, language: 'fr'}, (err, res: any) => {
            if (err || !res) {
                return defer.reject(err);
            }
            defer.resolve(res.results);
        });

        return defer.promise;
    }

    /**
     * Return image link closest from size
     * @param type
     * @param width
     * @returns {any}
     */
    public getSizeCloseTo(type, width) {
        switch (type) {
            case "p":
                type = "poster_sizes";
                break;
            case "b":
                type = "backdrop_sizes";
                break;
            case "c":
                type = "profile_sizes";
                break;
        }

        for (let s of this.config.images[type]) {
            if (parseInt(s.substr(1)) >= width) {
                return s;
            }
        }

        return 'original';
    }

    public createAutocompleteFromTMDBResults(movies: Array<ITMDBMovie>) {
        return _.map(movies, (m) => {
            return {
                title: m.title,
                originalTitle: m.original_title,
                date: m.release_date ? new Date(m.release_date) : null,
                poster: m.poster_path ? this.config.images.base_url + this.getSizeCloseTo('p', 50) + m.poster_path : null,
                tmdbId: m.id
            }
        });
    }
}

export interface ITMDBMovie {
    id: number;
    imdb_id: number;
    title: string;
    original_title: string;
    release_date?: string;
    genres?: Array<{name: string}>;
    overview: string;
    runtime: number;
    vote_count: number;
    vote_average: number;
    budget: number;
    revenue: number;
    poster_path: string;
    backdrop_path: string;
    original_language: string;
    production_countries: Array<{iso_3166_1: string}>;
    credits: {
        cast: Array<{id: number, name: string, character: string, profile_path: string, order: number}>,
        crew: Array<{id: number, name: string, job: string, profile_path: string, department: string}>
    };
    videos: {results: Array<{id: number, name: string, key: string, iso_639_1: string, site: string, size: number, type: string}>}

}

export default new TMDB();