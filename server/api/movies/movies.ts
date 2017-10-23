import * as q from "q"

import Movie from "../../schemas/Movie.schema"
import File from "../../schemas/File.schema"
import TMDB from "../../modules/TMDB"
import {ARoutes, RoutePermissions} from "../../middlewares/Resty";

/**
 * Resource class
 */
class Resource extends ARoutes {
    public permissions: IRoutePermissions = new RoutePermissions(null, 'user', 'admin');

    /**
     * Resource GET Route
     * @param id
     * @param next
     */
    public get(id: string, next: RestyCallback): void {
        Movie.get(id, {populate: 'files'})
            .then(next)
            .catch(next);
    }

    /**
     * Resource PUT Route - Change movie related to file
     * @param fid
     * @param next
     */
    public put(fid: string, next: RestyCallback): void {
        File.get(fid)
            .then((file: IFile) => {
                TMDB.get(this.data.tmdbId, file)
                    .then((movie: IMovie) => {
                        Movie.findWithFileId(fid)
                            .then(items => {
                                this._unlinkMovies(items, fid, movie._id).then(() => {
                                    file.save(err => {
                                        if (err) return callback(500, err);
                                        movie.save(err => {
                                            if (err) return callback(500, err);
                                            callback(null, movie);
                                        });
                                    });
                                });
                            })
                            .catch(next)
                    })
                    .catch(next)
            })
            .catch(next);
    }

    private _unlinkMovies(movies: Array<IMovie>, fileId, movieId) {
        const defer = q.defer();
        const promises = [];

        for (let m of movies) {
            if (!m._id.equals(movieId)) {
                promises.push(this._unlinkMovie(m, fileId));
            }
        }

        q.allSettled(promises)
            .then(() => defer.resolve());

        return defer.promise;
    }

    private _unlinkMovie(movie: IMovie, fileId) {
        const defer = q.defer();

        if (movie.files.length > 1) {
            const idx = _.findIndex(movie.files, (f) => {
                return f._id === fileId;
            });
            if (idx !== -1) {
                movie.files[idx].movie = null;
                movie.files[idx].save(() => {
                    movie.files.splice(idx, 1);
                    movie.save(() => {
                        defer.resolve();
                    });
                })
            } else {
                defer.resolve();
            }
        } else if (movie.files.length === 1) {
            movie.files[0]._movie = null;
            movie.files[0].save(() => {
                movie.remove(() => {
                    defer.resolve();
                });
            });
        } else {
            movie.remove(() => {
                defer.resolve();
            });
        }

        return defer.promise;
    }
}

/**
 * Collection class
 */
class Collection extends ARoutes {
    public permissions: IRoutePermissions = new RoutePermissions('admin');

    /**
     * Collection GET Route
     * @param next
     */
    public get(next: RestyCallback): void {

    }
}

module.exports = {
    Resource: new Resource(),
    Collection: new Collection()
};