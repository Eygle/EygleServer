/**
 * Created by Eygle on 28/02/2017.
 */

class KeyEventsService {
  private pressed: Array<string> = [];
  private isMac: boolean = false;

  public setIsMac(val: boolean) {
    this.isMac = val;
  }

  public onCancel = () => {
  };
  public onValidate = () => {
  };
  public onSelectAll = () => {
  };
  public onCopy = () => {
  };
  public onCut = () => {
  };
  public onPaste = () => {
  };
  public onDelete = () => {
  };
  public onRename = () => {
  };
  public onRollback = () => {
  };

  public onUp = () => {
  };
  public onDown = () => {
  };
  public onLeft = () => {
  };
  public onRight = () => {
  };

  /**
   * Is key pressed
   * @param key
   * @returns {boolean}
   */
  public isPressed = (key) => {
    for (let code of this.pressed) {
      if (key == code) {
        return true;
      }
    }
    return false;
  };

  /**
   * Check if CTRL or MAC CMD is pressed to catch shortcuts
   * @returns {boolean}
   */
  public isHoldingCmdKey = () => {
    if (this.isMac) {
      return this.isPressed(EKeyCode.OSX_L) || this.isPressed(EKeyCode.OSX_R);
    }
    return this.isPressed(EKeyCode.CTRL);
  };

  /**
   * Called when keydown event is triggered
   * This MUST be set and bind to directive key-events
   * @param code
   */
  public onKeyDown = (code) => {
    switch (code) {
      case EKeyCode.ESCAPE:
        this.onCancel();
        break;
      case EKeyCode.ENTER:
        this.onValidate();
        break;
      case EKeyCode.A:
        if (this.isHoldingCmdKey()) {
          this.onSelectAll();
        }
        break;
      case EKeyCode.C:
        if (this.isHoldingCmdKey()) {
          this.onCopy();
        }
        break;
      case EKeyCode.X:
        if (this.isHoldingCmdKey()) {
          this.onCut();
        }
        break;
      case EKeyCode.V:
        if (this.isHoldingCmdKey()) {
          this.onPaste();
        }
        break;
      case EKeyCode.Z:
        if (this.isHoldingCmdKey()) {
          this.onRollback();
        }
        break;
      case EKeyCode.F2:
        this.onRename();
        break;
      case EKeyCode.BACKSPACE:
      case EKeyCode.DELETE:
        this.onDelete();
        break;
      case EKeyCode.UP:
        this.onUp();
        break;
      case EKeyCode.DOWN:
        this.onDown();
        break;
      case EKeyCode.LEFT:
        this.onLeft();
        break;
      case EKeyCode.RIGHT:
        this.onRight();
        break;
      case EKeyCode.SHIFT:
      case EKeyCode.CTRL:
      case EKeyCode.ALT:
      case EKeyCode.OSX_R:
      case EKeyCode.OSX_L:
      case EKeyCode.WINDOW_L:
      case EKeyCode.WINDOW_R:
        if (!this.isPressed(code)) {
          this.pressed.push(code);
        }
        break;
    }
  };


  /**
   * Called when keyup event is triggered
   * This MUST be set and bind to directive key-events
   * @param code
   */
  public onKeyUp = (code) => {
    for (let idx = 0; idx < this.pressed.length; idx++) {
      if (this.pressed[idx] == code) {
        this.pressed.splice(idx, 1);
      }
    }
  };
}

angular
  .module('eygle.services.keyEvents')
  .service('KeyEventsService', KeyEventsService);
