import * as q from "q"
import * as _ from "underscore"

import Utils from "../../config/Utils"
import Movie from "../../schemas/Movie.schema"
import File from "../../schemas/File.schema"
import TMDB from "../../modules/TMDB"
import {ARoute} from "../../middlewares/Resty";
import {EPermission} from "../../typings/enums";

/**
 * Resource class
 */
class Resource extends ARoute {

    constructor() {
        super();
        this.setGetPermission(EPermission.LoggedUser);
        this.setPostOrPutPermission(EPermission.Admin);
    }

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
            .then((file: IEygleFile) => {
                TMDB.get(this.data.tmdbId, file)
                    .then((movie: IMovie) => {
                        Movie.findWithFileId(fid)
                            .then((items: Array<IMovie>) => {
                                const promises = [];

                                for (let m of items) {
                                    if (!Utils.compareIds(m, movie)) {
                                        promises.push(this._unlinkMovie(m, fid));
                                    }
                                }

                                q.allSettled(promises)
                                    .then(() => {
                                        q.allSettled([
                                            File.save(file),
                                            Movie.save(movie)
                                        ])
                                            .then(() => next())
                                            .catch(next);
                                    });
                            })
                            .catch(next)
                    })
                    .catch(next)
            })
            .catch(next);
    }

    /**
     * Unlink movie from file
     * @param {IMovie} movie
     * @param fileId
     * @return {Q.Promise<any>}
     * @private
     */
    private _unlinkMovie(movie: IMovie, fileId) {
        const defer = q.defer();

        if (movie.files.length > 1) {
            const idx = _.findIndex(movie.files, (f) => {
                return Utils.compareIds(f, fileId);
            });

            if (!!~idx) {
                const f = <IEygleFile>movie.files.splice(idx, 1)[0];

                f.movie = null;
                q.allSettled([
                    File.save(f),
                    Movie.save(movie)
                ])
                    .then(defer.resolve)
                    .catch(defer.reject);
            } else {
                defer.resolve();
            }
        } else if (movie.files.length === 1) {
            (<IEygleFile>movie.files[0]).movie = null;
            q.allSettled([
                File.save(movie.files[0]),
                Movie.setDeleted(movie)
            ])
                .then(defer.resolve)
                .catch(defer.reject);
        } else {
            Movie.setDeleted(movie)
                .then(defer.resolve)
                .catch(defer.reject);
        }

        return defer.promise;
    }
}

/**
 * Collection class
 */
class Collection extends ARoute {

    constructor() {
        super(EPermission.Admin);
    }

    /**
     * Collection GET Route
     * @param next
     */
    public get(next: RestyCallback): void {

    }
}

module.exports.Collection = Collection;
module.exports.Resource = Resource;