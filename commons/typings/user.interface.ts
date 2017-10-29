interface IUser extends IModel {
   email?: string;
   userName?: string;

   password?: string;
   validMail?: string;
   locked?: boolean;
   changePassword?: boolean;

   roles: Array<string>;
   desc?: string;
}