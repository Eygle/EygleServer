/**
 * Created by eygle on 5/6/17.
 */

interface IMovie {
  _file: IFile,

  title: string,
  originalTitle: string,
  date: Date,
  countries: [{ type: string }],
  genres: [{ type: string }],
  overview: string,
  budget: number,
  revenue: number,
  originalLanguage: string,
  runtime: number,

  poster: string,
  backdrop: string,

  cast: [{
    tvdbId: number,
    name: string,
    character: string,
    image: string
  }],
  crew: [{
    tvdbId: number,
    name: string,
    job: string,
    image: string,
  }],

  videos: [{
    id: string,
    lang: string,
    key: string,
    name: string,
    site: string,
    size: number,
    videoType: string
  }],

  tmdbId: number,
  imdbId: string,

  creationDate: Date,
  updateDate: Date,

  deleted: boolean
}

interface IAutocompleteMovie {
  title: string,
  originalTitle: string,
  date: Date,
  poster: string,
  tmdbId: string
}