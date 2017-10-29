/**
 * Created by eygle on 5/13/17.
 */

class ModalIdentifyFileController {
   public file: IEygleFile;

   public mediaType: EMedia;

   public mediaTypes: Array<any>;

   public movie: IAutocompleteMovie;

   public tvShow;

   constructor(private ModalService: ModalService,
               private ToastService: ToastService,
               private Api: Api) {
      this.mediaTypes = [
         {label: 'MEDIAS.MOVIE', value: EMedia.Movie},
         {label: 'MEDIAS.TV_SHOW', value: EMedia.TVShow}
      ];
      this.mediaType = EMedia.Movie;
   }

   public saveMovie = (movie: IAutocompleteMovie) => {
      this.movie = movie;
      console.log(movie);
   };

   /**
    * Submit
    */
   public submit = (): void => {
      if (this.movie) {
         this.Api.movies.byId.save({id: this.file._id, tmdbId: this.movie.tmdbId}, () => {
            this.ToastService.show(EStatus.Ok);
            return this.ModalService.close(EStatus.Ok);
         }, (err) => {
            console.error(err);
            this.ToastService.show(EStatus.RejectByServer);
         });
      }
   };

   /**
    * Close the modal without actions performing
    */
   public cancel = (): void => {
      this.ModalService.cancel(EStatus.CloseByUser);
   };
}

angular.module('eygle.services.files')
   .controller('ModalIdentifyFileController', ModalIdentifyFileController);