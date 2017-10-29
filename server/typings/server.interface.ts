interface ILogger {
   log: (...any) => void;
   trace: (...any) => void;
   debug: (...any) => void;
   info: (...any) => void;
   warn: (...any) => void;
   error: (...any) => void;
}

interface IPermission {
   name: string,
   roles: Array<string>;
}

interface IRoutePermissions {
   'default'?: string;
   get?: string;
   postPut?: string;
   'delete'?: string;
}

interface ILoginAttempt {
   locked: boolean;
   list: Array<number>;
}
