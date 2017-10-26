/**
 * Created by eygle on 5/6/17.
 */

interface IEpisode extends IModel {
  title: string,

  tvdbId: number,
  tvdbSeasonId: number,

  tvShow: ITVShow,
  files: Array<IEygleFile>,

  number: number,
  season: number,

  overview: string,
}