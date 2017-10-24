export enum EEnv {
    Prod = 0,
    Preprod,
    Dev,
    Test
}

export enum EHTTPStatus {
    BadRequest = 400,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
}

export enum EPermission {
    LoggedUser = "loggedUser",
    Admin = "admin",
    Public = "public"
}