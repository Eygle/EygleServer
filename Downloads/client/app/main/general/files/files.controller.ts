/**
 * Created by eygle on 4/29/17.
 */

class FilesController {
  public files: Array<IFile>;

  public current: Array<IFile>;

  public isLoading: boolean;

  constructor(private Api: Api, private $translate: any) {
    this.isLoading = true;
  }

  $onInit() {
    this.Api.files.get((res) => {
      this.files = res;
      this.loadFilesFrom();
      this.isLoading = false;
    });
  }

  public loadFilesFrom(file: IFile = null): void {
    console.log("inside load from");
    let files = !file ? this.files : (file.isDirectory ? file.children : null);
    if (!files) return;
    this.current = files.length && files[0].icon ? files : this._formatData(files);
  };

  private _formatData(files: Array<IFile>): Array<IFile> {
    for (let f of files) {
      if (f.isDirectory) {
        f.icon = "icon-folder";
        f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.DIRECTORY");
      } else {
        switch (f.extname) {
          default:
            f.icon = "icon-file-document";
            f.type = "file";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.FILE");
            break;
          case ".avi":
          case ".mp4":
          case ".mkv":
          case ".wmv":
          case ".ts":
            f.icon = "icon-file-video";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.VIDEO");
            break;
          case ".jpg":
          case ".bmp":
          case ".gif":
          case ".png":
          case ".svg":
          case ".ai":
            f.icon = "con-file-image";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.IMAGE");
            break;
          case ".mp3":
          case ".flac":
          case ".wma":
            f.icon = "icon-file-music";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.AUDIO");
            break;
          case ".txt":
          case ".csv":
          case ".json":
          case ".rtf":
            f.icon = "icon-file-document";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.TEXT");
            break;
          case ".pdf":
            f.icon = "icon-file-pdf";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.PDF");
            break;
          case ".doc":
          case ".docx":
          case ".odt":
            f.icon = "icon-file-word";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.WORD");
            break;
          case ".xls":
          case ".xlsx":
          case ".ods":
            f.icon = "icon-file-excel";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.WORD");
            break;
          case ".ppt":
          case ".pptx":
            f.icon = "icon-file-powerpoint";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.POWERPOINT");
            break;
          case ".zip":
          case ".rar":
          case ".7z":
            f.icon = "icon-archive";
            f.typeLabel = this.$translate.instant("GENERAL.FILES.TYPES.ARCHIVE");
            break;
        }
      }
    }

    return files;
  };
}

angular.module('eygle.files')
  .controller('FilesController', FilesController);