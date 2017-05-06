/**
 * Created by eygle on 5/6/17.
 */

interface IFile {
  filename: string,
  ext: string,
  size: number,
  path: string,
  normalized: string,
  mtime: Date,

  _episode: IEpisode,
  _movie: IMovie,

  creationDate: Date,
  updateDate: Date,

  deleted: boolean
}