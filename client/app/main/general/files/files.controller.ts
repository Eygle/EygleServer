/**
 * Created by eygle on 4/29/17.
 */

class FilesController {
  /**
   * List of files to display
   */
  public files: Array<IEygleFile>;

  public fs: FilesService;

  /**
   * Breadcrumbs
   */
  public bc: Array<IEygleFile>;

  private _current: IEygleFile;

  constructor(private FilesService: FilesService,
              private $stateParams: any,
              private $scope: any) {
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
            this.files = [this._current];
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
        dir = this.fs.getFileById(dir.parent);
      }
      this.bc.unshift(null)
    } else {
      this.bc.push(null);
    }
  };
}

angular.module('eygle.files')
  .controller('FilesController', FilesController);