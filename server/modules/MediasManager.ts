import * as fs from "fs";
import * as q from "q";
import * as path from "path";
import * as _ from "underscore";
import * as ptn from "parse-torrent-name";

import Utils from "../config/Utils"
import File from "../schemas/File.schema"

class MediasManager {
    /**
     * List of local files to process and add in database
     */
    private _filesToAdd: Array<ILocalFile>;

    /**
     * List of files tnot present anymore to remove from database
     */
    private _filesToDelete: Array<ILocalFile>;

    /**
     * Number of movies added
     */
    private _nbrMoviesAdded: number;

    /**
     * Number of tv shows added
     */
    private _nbrTVShowsAdded: number;

    /**
     * Number of files added
     */
    private _nbrFilesAdded: number;

    /**
     * Number of files deleted
     */
    private _nbrFilesDeleted: number;

    /**
     * Dump JSON file path
     */
    private _dumpPath: string;

    /**
     * List of videos extensions
     */
    private _videoExtensions: Array<string>;

    constructor() {
        this._dumpPath = `${Utils.filesRoot}/dl-files-dump.json`;
        this._videoExtensions = [".avi", ".mkv", ".webm", ".flv", ".vob", ".ogg", ".ogv", ".mov", ".qt",
            ".wmv", ".mp4", ".m4p", ".m4v", ".mpg", ".mp2", ".mpeg", ".mpe", ".mpv"];

        this._filesToAdd = [];
        this._nbrMoviesAdded = 0;
        this._nbrTVShowsAdded = 0;
        this._nbrFilesAdded = 0;
        this._nbrFilesDeleted = 0;
    }

    /**
     * Get full list of local files
     * Compare to previous list
     * Save new medias
     * Remove deleted medias
     */
    public synchronize() {
        const defer = q.defer();
        const previous = this._load();
        const files: Array<ILocalFile> = this._listDirectory(`${Utils.filesRoot}/downloads`);

        for (let f of files) {
            const idx = _.findIndex(previous, (o) => {
                return o.filename === f.filename && o.size === f.size && o.path === f.path;
            });

            if (!~idx) {
                this._filesToAdd.push(f);
            } else {
                previous.splice(idx, 1);
            }
        }
        // Add remaining files (not present anymore) to files to delete list
        this._filesToDelete = previous;
        this._dump(files);

        q.allSettled([
            this._processFilesToAdd(),
            this._processFilesToDelete()
        ])
            .then(() => {
                this._saveNewFiles()
                    .then(() => {
                        Utils.logger.log(`${this._nbrMoviesAdded} movies added`);
                        Utils.logger.log(`${this._nbrTVShowsAdded} tv shows added`);
                        Utils.logger.log(`${this._nbrFilesAdded} files added`);
                        Utils.logger.log(`${this._nbrFilesDeleted} files deleted`);
                        defer.resolve();
                    })
                    .catch(defer.reject)
            })
            .catch(defer.reject);

        return defer.promise;
    }

    /**
     * Add all new files to database and extract medias if possible
     * Remove all files to delete
     * @return {Q.Promise<any>}
     * @private
     */
    private _processFilesToAdd(list = this._filesToAdd, parent: IEygleFile = null) {
        const promises = [];

        for (let f of list) {
            f.parent = parent ? parent._id.toString() : null;
            f.model = File.create(f);
            if (f.directory && f.children) {
                this._processFilesToAdd(f.children, f.model);
            } else {
                if (this._isVideo(f.filename)) {
                    if (!f.mediaInfo) {
                        f.mediaInfo = ptn(f.filename);
                    }
                    if (!f.mediaInfo.title) continue;

                    const fullPath = f.path ? `${f.path}/${f.filename}` : f.filename;
                    if (this._isTVShow(fullPath)) {
                        if (f.mediaInfo.hasOwnProperty('episode') && f.mediaInfo.hasOwnProperty('season')) {
                            promises.push(this._addTVShowFromFile(f));
                        }
                    }
                    else {
                        promises.push(this._addMovieFromFile(f));
                    }
                }
            }
        }

        return q.allSettled[promises];
    }

    /**
     * Delete all filesToDelete from database and the linked media
     * @return {Q.Promise<any>}
     * @private
     */
    private _processFilesToDelete() {
        const promises = [];

        for (let f of this._filesToDelete) {
            const defer = q.defer();

            this._nbrFilesDeleted++;
            defer.resolve();

            promises.push(defer.promise);
        }

        return q.allSettled[promises];
    }

    /**
     *
     * @private
     * @param file
     */
    private _addMovieFromFile(file: ILocalFile) {
        const defer = q.defer();

        if (file.mediaInfo.title) {
            movies.searchMovieByTitle(file.mediaInfo.title).then(results => {
                if (results.length === 0) {
                    callback();
                } else if (results.length === 1) {
                    fetchInfoAndSave(file, results[0].id, callback);
                } else {
                    if (file.mediaInfo.year) {
                        for (let m of results) {
                            if (m.release_date && new Date(m.release_date).getFullYear() === file.mediaInfo.year) {
                                fetchInfoAndSave(file, m.id, callback);
                                return;
                            }
                        }
                    }

                    saveProposals(results, file, callback);
                }
            }).catch(err => {
                Utils.logger.error('[TMDB:searchByTitle] error', err);
                defer.reject();
            });
        } else {
            Utils.logger.warn(`Skipped ${file.filename}: no exploitable title`);
            defer.reject();
        }

        return defer.promise;
    }

    private _saveNewFiles() {
        const promises = [];

        for (let f of this._filesToAdd) {
            if (f.model) {
                promises.push(File.save(f.model));
                this._nbrFilesAdded++;
            }
        }

        return q.allSettled(promises);
    }

    /**
     * List directory files
     * @param dir
     * @param {any} parent
     * @param {any} filePath
     * @return {ILocalFile[]} full hierarchy
     * @private
     */
    private _listDirectory(dir, filePath = null) {
        return _.map(fs.readdirSync(dir), (f) => {
            const filename = path.join(dir, f);
            const stats = fs.statSync(filename);
            const file: ILocalFile = <ILocalFile>{
                filename: f,
                directory: stats.isDirectory(),
                mtime: stats.mtime,
                path: filePath
            };
            if (stats.isDirectory()) {
                file.children = this._listDirectory(filename, filePath ? filePath + '/' + f : f);
                file.size = this._filesSize(file.children);
            } else {
                file.ext = path.extname(f);
                file.size = stats.size;
            }

            return file;
        });
    }

    /**
     * Check if file is a video using it's path extension
     * @param filename
     * @returns {boolean}
     */
    private _isVideo(filename: string) {
        return this._videoExtensions.indexOf(path.extname(filename)) !== -1;
    }

    /**
     * Check if path relate to a tv show using it's full path (the info can be in the parent folder)
     * @param path
     * @return {any}
     */
    private _isTVShow(path) {
        const files = path.split('/');

        for (let f of files) {
            const info = ptn(f);
            if (info.season || info.episode)
                return true;
        }

        return files.length > 1 && files[files.length - 2].match(/(seasons?|saisons?)/i);

    };

    /**
     * Return size of a given directory
     * @param files
     * @return {number}
     * @private
     */
    private _filesSize(files) {
        return _.reduce(files, (memo: number, f: ILocalFile) => {
            return memo + f.size;
        }, 0);
    }

    /**
     * Dump full files list into a local JSON file
     */
    private _dump(data: Array<ILocalFile>) {
        fs.writeFileSync(this._dumpPath, JSON.stringify(data));
    }

    /**
     * Load previous full files list from local JSON file
     */
    private _load() {
        if (!fs.existsSync(this._dumpPath)) {
            return [];
        }

        const json = <string>fs.readFileSync(this._dumpPath);
        return json ? JSON.parse(json) : [];
    }
}

export default new MediasManager();