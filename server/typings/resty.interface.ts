interface IRestyContext {
	data: any;
	req: any;
	user: IUser;
	ensureAuthorized: any;
}

type RestyCallback = (data?: any) => void;