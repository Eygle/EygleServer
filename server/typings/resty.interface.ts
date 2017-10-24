interface IRestyContext {
	data: any;
	req: any;
	user: IUser;
}

type RestyCallback = (data?: any) => void;