interface IProposal extends IModel {
   title: string;
   originalTitle: string;
   date: Date;
   overview: string;
   poster: string;

   tmdbId: number;

   file: IEygleFile
}