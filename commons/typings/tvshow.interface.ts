/**
 * Created by eygle on 5/6/17.
 */

interface ITVShow extends IModel {
  title: string,

  tvdbId: number,
  imdbId: number,

  banner: string,
  poster: string,
  genres: [{ type: string }],
  overview: string,

  actors: [string], // TODO change

  seasons: number,
  episodes: number,
  start: Date,
  end: Date,
  network: string,

  episodesList: Array<IEpisode>
}