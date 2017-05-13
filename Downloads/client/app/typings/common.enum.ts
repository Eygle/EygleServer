/**
 * Created by eygle on 4/29/17.
 */

/**
 * Keyboard key codes
 */
enum EKeyCode {
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  SHIFT = 16,
  CTRL = 17,
  ALT = 18,
  ESCAPE = 27,
  HOME = 36,
  LEFT,
  UP,
  RIGHT,
  DOWN,
  INSERT = 45,
  DELETE = 46,
  A = 65,
  C = 67,
  V = 86,
  X = 88,
  Z = 90,
  WINDOW_L = 91, // Windows/OSX Left
  OSX_L = 91, // Windows/OSX Left
  WINDOW_R = 92, // Window Right
  OSX_R = 93, // OSX Right/Select
  F2 = 113
}

enum ELvl {
  INFO = 1,
  SUCCESS,
  ERROR,
  WARNING
}

enum EStatus {
  Ok = 1,
  CustomOk,
  CustomError,
  RejectByServer,
  NoDataProvided,
  NoResult,
  NoAccess,
  LoginFail,
  LoginCaptchaFail,
  LoginEmailNotVerified,
  RejectByUser
}