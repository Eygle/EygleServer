/**
 * Created by eygle on 5/13/17.
 */

class FilesService {
  public files: Array<IEygleFile>;

  public selected: Array<IEygleFile>;

  constructor(private Api: Api,
              private ToastService: ToastService,
              private ModalService: ModalService,
              private _: any,
              private $state: any,
              private $q: any) {
    this.selected = [];
  }

  /**
   * Get list of files from server
   */
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

  /**
   * Get list of files from Service or server
   * @returns {any}
   */
  public getAll = () => {
    const defer = this.$q.defer();

    if (!this.files) {
      return this.refreshFilesList();
    } else {
      defer.resolve();
    }

    return defer.promise;
  };

  /**
   * Select a file
   * @param file
   */
  public select = (file: IEygleFile) => {
    if (file.selected) {
      const idx = this._.findIndex(this.selected, (v) => {
        return v._id === file._id;
      });
      this.selected.splice(idx, 1);
    }

    if (true) { // Not holding CMD key
      this._unselectAll();
    }

    if (!file.selected) {
      this.selected.push(file);
    }
    file.selected = !file.selected;
  };

  /**
   * Open a folder
   * @param file
   * @param force
   */
  public open = (file: IEygleFile, force = false) => {
    if (file.directory || force) {
      this._unselectAll();
      this.$state.go('eygle.files.file', {id: file._id});
    }
  };

  /**
   * Link a media to the selected file
   */
  public identify = (event) => {
    if (this.selected.length > 1 || this.selected.length === 0 || this.selected[0].directory) {
      return;
    }

    this.ModalService.show({
      component: 'modal-identify-file',
      bindings: {
        file: this.selected[0]
      },
      ev: event,
      escapeToClose: true
    }).then(() => {
      this.refreshFilesList();
    });
  };

  /**
   * Find file by id
   * @param id
   * @param directory
   * @returns {any}
   */
  public getFileById = (id, directory = null): IEygleFile => {
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

  /**
   * Clear select list
   * @private
   */
  private _unselectAll = () => {
    for (let f of this.selected) {
      f.selected = false;
    }

    this.selected = [];
  };

  /**
   * Format files to be displayed (icon and typeLabel)
   * @param files
   * @private
   */
  private _formatFiles = (files) => {
    for (let f of files) {
      if (f._movie) {
        f.icon = "icon-movie";
        f.typeLabel = "FILES.TYPES.MOVIE";
        continue;
      }

      if (f._tvshow) {
        f.icon = "icon-tv";
        f.typeLabel = "FILES.TYPES.TV_SHOW";
        continue;
      }

      if (f.directory) {
        f.icon = "icon-folder";
        f.typeLabel = "FILES.TYPES.DIRECTORY";
        if (f.children) {
          this._formatFiles(f.children);
        }
        continue;
      }

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
  };
}

angular.module('eygle.services.files')
  .service('FilesService', FilesService);