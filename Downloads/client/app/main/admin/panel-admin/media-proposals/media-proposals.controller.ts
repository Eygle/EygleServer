/**
 * Created by eygle on 5/11/17.
 */

class MediaProposalsController {
  public movies;

  constructor(private Api: Api) {
  }

  $onInit() {
    this.Api.proposals.get(res => {
      this.movies = _.map(res, v => {
        v.mtime = new Date(v.mtime);
        for (let p of v.proposals) {
          p.date = new Date(p.date);
        }
        return v;
      });
    });
  }

  public deleteProposals = (file: IFile): void => {
    this.Api.proposals.remove({id: file._id}, res => {
      this.movies.splice(_.findIndex(this.movies, (v) => {
        return v._id === file._id;
      }), 1);
    }, err => {
      console.error(err); //TODO Toast
    });
  };

  public choose = (proposal): void => {
    this.Api.proposals.choose({id: proposal._id}, res => {
      console.log(res);
    }, err => {
      console.error(err); //TODO Toast
    });
  }
}

angular.module('eygle.admin.panel-admin')
  .controller('MediaProposalsController', MediaProposalsController);