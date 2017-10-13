interface IUser extends IModel {
   email: string;
   userName: string;
   password: string;

   emailCheckCode: string;
   locked: boolean;

   roles: Array<string>;
   desc: string;
}