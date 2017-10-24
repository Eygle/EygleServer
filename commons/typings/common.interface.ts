/**
 * Created by eygle on 4/29/17.
 */

interface ILocalFile {
  _id: string,

  filename: string,
  directory: boolean,
  parent: ILocalFile,
  movie: string
  tvshow: string

  ext?: string,
  size?: number,
  mtime?: Date,
  children?: Array<ILocalFile>,

  // Views attributes
  type?: string,
  icon?: string,
  typeLabel?: string
  selected: boolean;
  loading: boolean;
}