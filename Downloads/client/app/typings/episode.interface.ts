/**
 * Created by eygle on 5/6/17.
 */

interface IEpisode {
  title: string,

  tvdbId: number,
  tvdbSeasonId: number,

  _tvShow: ITVShow,
  _file: IEygleFile,

  number: number,
  season: number,

  overview: string,

  creationDate: Date,
  updateDate: Date,

  deleted: boolean
}