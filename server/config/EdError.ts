import {EHTTPStatus} from "../typings/enums";

export class EdError extends Error {
   /**
    * HTTP status code
    */
   public status: number;

   /**
    * Constructor
    * @param httpStatus
    */
   constructor(httpStatus: EHTTPStatus) {
      switch (httpStatus) {
         case EHTTPStatus.BadRequest:
            super("Bad Request");
            break;
         case EHTTPStatus.Forbidden:
            super("Permission Denied");
            break;
         case EHTTPStatus.NotFound:
            super("Not Found");
            break;
         case EHTTPStatus.InternalServerError:
            super("Internal Server Error");
            break;
      }
      this.status = httpStatus;
   }
}

export class CustomEdError extends EdError {
   /**
    * Constructor
    * @param message
    * @param code
    */
   constructor(message: string = null, code: number = 500) {
      super(code);
      if (message) {
         this.message = message;
      }
   }
}

export default EdError;
