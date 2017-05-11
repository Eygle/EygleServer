/**
 * Created by eygle on 4/29/17.
 */

interface IFile {
  _id: string,

  filename: string,
  directory: boolean,
  parent: string,

  extname?: string,
  size?: number,
  mtime?: Date,
  children?: Array<IFile>,

  // Views attributes
  type?: string,
  icon?: string,
  typeLabel?: string
}