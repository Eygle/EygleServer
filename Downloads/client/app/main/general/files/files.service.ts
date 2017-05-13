/**
 * Created by eygle on 5/13/17.
 */

class FilesService {
  public files: Array<IFile>;

  constructor(private Api: Api,
              private ToastService: ToastService,
              private $state: any,
              private $q: any) {
  }

  public refreshFilesList = () => {
    const defer = this.$q.defer();

    this.Api.files.get((res) => {
      this._formatFiles(res);
      this.files = res;
      defer.resolve(this.files);
    }, err => {
      console.error(err);
      this.ToastService.show(EStatus.RejectByServer);
    });

    return defer.promise;
  };

  public getAll = () => {
    const defer = this.$q.defer();

    if (!this.files) {
      return this.refreshFilesList();
    } else {
      defer.resolve();
    }

    return defer.promise;
  };

  public select = (file: IFile) => {

  };

  public open = (file: IFile, force = false) => {
    if (file.directory || force) {
      this.$state.go('eygle.files.file', {id: file._id});
    }
  };

  public getFileById = (id, directory = null): IFile => {
    const dir = [];

    for (let f of directory || this.files) {
      if (f._id === id) {
        return f;
      }
      if (f.directory) {
        dir.push(f);
      }
    }

    for (let d of dir) {
      let res = this.getFileById(id, d.children);
      if (res) {
        return res;
      }
    }

    return null;
  };

  private _formatFiles = (files) => {
    for (let f of files) {
      if (f.directory) {
        f.icon = "icon-folder";
        f.typeLabel = "FILES.TYPES.DIRECTORY";
        if (f.children) {
          this._formatFiles(f.children);
        }
      } else {
        switch (f.ext) {
          default:
            f.icon = "icon-file-document";
            f.type = "file";
            f.typeLabel = "FILES.TYPES.FILE";
            break;
          case ".avi":
          case ".mp4":
          case ".mkv":
          case ".wmv":
          case ".ts":
            f.icon = "icon-file-video";
            f.typeLabel = "FILES.TYPES.VIDEO";
            break;
          case ".jpg":
          case ".bmp":
          case ".gif":
          case ".png":
          case ".svg":
          case ".ai":
            f.icon = "con-file-image";
            f.typeLabel = "FILES.TYPES.IMAGE";
            break;
          case ".mp3":
          case ".flac":
          case ".wma":
            f.icon = "icon-file-music";
            f.typeLabel = "FILES.TYPES.AUDIO";
            break;
          case ".txt":
          case ".csv":
          case ".json":
          case ".rtf":
            f.icon = "icon-file-document";
            f.typeLabel = "FILES.TYPES.TEXT";
            break;
          case ".pdf":
            f.icon = "icon-file-pdf";
            f.typeLabel = "FILES.TYPES.PDF";
            break;
          case ".doc":
          case ".docx":
          case ".odt":
            f.icon = "icon-file-word";
            f.typeLabel = "FILES.TYPES.WORD";
            break;
          case ".xls":
          case ".xlsx":
          case ".ods":
            f.icon = "icon-file-excel";
            f.typeLabel = "FILES.TYPES.WORD";
            break;
          case ".ppt":
          case ".pptx":
            f.icon = "icon-file-powerpoint";
            f.typeLabel = "FILES.TYPES.POWERPOINT";
            break;
          case ".zip":
          case ".rar":
          case ".7z":
            f.icon = "icon-archive";
            f.typeLabel = "FILES.TYPES.ARCHIVE";
            break;
        }
      }
    }
  };
}

angular.module('eygle.files')
  .service('FilesService', FilesService);