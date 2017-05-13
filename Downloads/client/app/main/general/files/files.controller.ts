/**
 * Created by eygle on 4/29/17.
 */

class FilesController {
  /**
   * List of files to display
   */
  public files: Array<IFile>;

  public fs: FilesService;

  /**
   * Breadcrumbs
   */
  public bc: Array<IFile>;

  private _current: IFile;

  constructor(private FilesService: FilesService,
              private $stateParams: any) {
    this.fs = this.FilesService;
    this._current = null;
    this.files = this.fs.files;
    this.bc = [null];
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
      this._populateBreadcrumbs();
    });
  }

  private _populateBreadcrumbs = () => {
    this.bc = [];
    if (this._current) {
      let dir = this._current;
      while (dir) {
        this.bc.unshift(dir);
        dir = this.fs.getFileById(dir._parent);
      }
      this.bc.unshift(null)
    } else {
      this.bc.push(null);
    }
  };
}

angular.module('eygle.files')
  .controller('FilesController', FilesController);