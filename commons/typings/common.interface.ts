/**
 * Created by eygle on 4/29/17.
 */

interface IFile {
  _id: string,

  filename: string,
  directory: boolean,
  parent: IFile,
  movie: string
  tvshow: string

  ext?: string,
  size?: number,
  mtime?: Date,
  children?: Array<IFile>,

  // Views attributes
  type?: string,
  icon?: string,
  typeLabel?: string
  selected: boolean;
  loading: boolean;
  movie?: string;
}