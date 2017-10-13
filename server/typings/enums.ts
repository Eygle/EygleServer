export enum EEnv {
	Prod = 0,
	Preprod,
	Dev,
	Test
}

export enum ELoanCat {
	LoanOrBorrow = 1,
	MAD = 2,
	MedicalDevices = 3,
	Prep = 4,
	Ste = 5,
	Request = 6
}

export enum EPDF {
	Invoice,
	Voucher,
	ReconciliationSheet,
	PharmaLetter,
	Equivalences,
	Stockouts
}

export enum EFileType {
	CLOUD = 0,
	ATTACH_NEWS,
	ATTACH_LOAN,
	LOGO,
	STE_IMG,
	ATTACH_STOCKOUT
}

export enum EDirRight {
	SEE_DIR        = 1,
	RENAME_DIR     = 2,
	MOVE_DIR       = 4,
	DELETE_DIR     = 8,
	RENAME_CHILD   = 16,
	MOVE_CHILD     = 32,
	DELETE_CHILD   = 64,
	ADD_CHILD      = 128,
	DOWNLOAD_CHILD = 256
}

export enum EDiscussionShare {
	Users = 1,
	Groups
}

export enum ESharingType {
	Self      = 0,
	Hospital  = 1,
	Group     = 3,
	Everybody = 4,
	Public    = 5,
	Region    = 6
}

export enum EStockoutInfoType {
	Clinician = 1,
	Comment
}

export enum EHTTPStatus {
	BadRequest          = 400,
	Forbidden           = 403,
	NotFound            = 404,
	InternalServerError = 500,
}

export enum EStaffRSP {
	DSP = 1,
	STR = 2,
	PRI = 4,
	PHC = 8,
	LOG = 16,
	VGL = 32,
	CMD = 64,
	ACM = 128,
	ACD = 256,
	ESC = 512,
	CHI = 1024,
	NUP = 2048,
	PRH = 4096,
	PRM = 8192,
	HYG = 16384,
	GAZ = 32768,
	COM = 65536,
	CLU = 131072,
	CLA = 262144,
	CLI = 524288,
	RET = 1048576,
}

export enum EEstablishmentType {
	Hospital = 1,
	Pharmacy
}

export enum Subscriptions {
	Availables = 'availableSummary',
}

export enum Geo {
	Lat = 0,
	Lng = 1
}

export enum EFileSharingType {
	HOSPITAL = 0,
	GROUP,
	REGION,
	MEMBER
}

export enum EGroup {
	Hospital = 1,
	User
}

export enum EInvitationType {
	Send = 1,
	Ask
}

export enum EIntercomTopic {
	CacheDelete = 'delete-from-cache',
	CronStartJob = 'cron-start-job',
   CronStopJob = 'cron-stop-job',
   CronScheduleJob = 'cron-schedule-job',
	CronListJobs = 'cron-list-jobs',
	CronAskJobs = 'cron-ask-jobs',
}