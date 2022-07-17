import {RouteController} from "../index"
import {
    LoginBody,
    LogoutBody,
    OAuthBody,
    PasswordResetBody,
    RefreshBody,
    RegisterBody,
    SendPasswordResetBody
} from "../validations/auth";
import {Request} from "express"
import * as core from "express-serve-static-core"


export type AuthRegisterController = RouteController<Request<core.ParamsDictionary, {}, RegisterBody>>

export type AuthLoginController = RouteController<Request<core.ParamsDictionary, {}, LoginBody>>

export type AuthLogoutController = RouteController<Request<core.ParamsDictionary, {}, LogoutBody>>

export type AuthOAuthController = RouteController<Request<core.ParamsDictionary, {}, OAuthBody>>

export type AuthRefreshController = RouteController<Request<core.ParamsDictionary, {}, RefreshBody>>

export type AuthSendPasswordResetController = RouteController<Request<core.ParamsDictionary, {}, SendPasswordResetBody>>

export type AuthResetPasswordController = RouteController<Request<core.ParamsDictionary, {}, PasswordResetBody>>
