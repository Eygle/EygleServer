/**
 * Created by eygle on 4/29/17.
 */

class FilesController {
  public files: Array<IFile>;

  public fs: FilesService;

  private _current: IFile;

  constructor(private FilesService: FilesService,
              private $stateParams: any) {
    this.fs = this.FilesService;
    this._current = null;
    this.files = this.fs.files;
  }

  $onInit() {
    this.FilesService.getAll().then(() => {
      if (!this.$stateParams.id) {
        this.files = this.fs.files;
      } else {
        this._current = this.fs.getFileById(this.$stateParams.id);
        if (this._current) {
          if (this._current.directory) {
            this.files = this._current.children;
          } else {
            // TODO filter by file id
            this.files = this._current._parent ? this._current._parent.children : this.fs.files;
          }
        }
      }
    });
  }
}

angular.module('eygle.files')
  .controller('FilesController', FilesController);