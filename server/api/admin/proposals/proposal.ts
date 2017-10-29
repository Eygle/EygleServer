import * as q from "q";

import Proposal from "../../../schemas/Proposal.schema"
import Movie from "../../../schemas/Movie.schema"
import File from "../../../schemas/File.schema"
import TMDB from "../../../modules/TMDB"
import {ARoute} from "../../../middlewares/Resty";
import {EPermission} from "../../../typings/enums";

/**
 * Resource class
 */
class Resource extends ARoute {

   constructor() {
      super(EPermission.ManageMultipleResults);
   }

   /**
    * Resource PUT Route - Choose a given proposal
    * @param id
    * @param next
    */
   public put(id: string, next: RestyCallback): void {
      Proposal.get(id, {
         select: {tmdbId: 1, file: 1},
         populate: 'file'
      })
         .then((proposal: IProposal) => {
            TMDB.get(proposal.tmdbId, proposal.file)
               .then((movie: IMovie) => {
                  q.allSettled([
                     File.save(proposal.file),
                     Movie.save(movie),
                     this._deleteAllProposalsLinkedToFile(proposal.file._id)
                  ])
                     .then(next)
                     .catch(next);
               })
               .catch(next);
         })
         .catch(next);
   }

   /**
    * Resource DELETE Route - Remove all proposals linked to a file id
    * @param fid
    * @param next
    */
   public delete(fid: string, next: RestyCallback): void {
      this._deleteAllProposalsLinkedToFile(fid)
         .then(next)
         .catch(next);

   }

   /**
    *
    * @param fid
    * @return {Q.Promise<any>}
    * @private
    */
   private _deleteAllProposalsLinkedToFile(fid) {
      const defer = q.defer();

      Proposal.getAllByFileId(fid.toString())
         .then((items: Array<IProposal>) => {
            const promises = [];

            for (let item of items) {
               promises.push(Proposal.remove(item));
            }

            q.allSettled(promises)
               .then(defer.resolve)
               .catch(defer.reject);
         })
         .catch(defer.reject);

      return defer.promise;
   }
}

/**
 * Collection class
 */
class Collection extends ARoute {

   constructor() {
      super(EPermission.ManageMultipleResults);
   }

   /**
    * Collection GET Route
    * @param next
    */
   public get(next: RestyCallback): void {
      Proposal.getAll({
         select: {file: 1, date: 1, title: 1, originalTitle: 1, poster: 1},
         populate: 'file'
      })
         .then((items) => next(this._groupProposalsByFile(items)))
         .catch(next);
   }

   /**
    * Transform a flat list of proposals in a list of files owning an array of proposals
    * @param {Array<>} proposals
    * @private
    */
   private _groupProposalsByFile(proposals: Array<any>) {
      // list of files as object to access by id
      const files = {};

      // populate files object with files
      // Each file has a proposal array
      for (let i in proposals) {
         if (proposals.hasOwnProperty(i)) {
            const proposal = proposals[i].toObject();
            const file = proposal._file;
            const fid = proposal._file._id;

            proposals[i] = proposal;

            if (!files[fid]) {
               file.proposals = [];
               files[fid] = file;
            }

            delete proposal._file;
            files[fid].proposals.push(proposal);
         }
      }

      // files object to array
      const res = [];
      for (let f in files) {
         if (files.hasOwnProperty(f)) {
            res.push(files[f]);
         }
      }

      return res;
   }
}

module.exports.Collection = Collection;
module.exports.Resource = Resource;