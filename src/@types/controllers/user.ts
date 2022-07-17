import {ParamController, RouteController} from "../index"
import mongoose from "mongoose"
import {
    CreateUserBody,
    ListUsersQuery,
    ReplaceUserBody,
    ReplaceUserParams,
    UpdateLoggedInBody,
    UpdateUserParams,
    UpdateUserBody,
    RemoveUserBody
} from "../validations/user"
import {Request} from "express"
import * as core from "express-serve-static-core"

export type UserLoadParamController = ParamController<mongoose.Types.ObjectId>

export type UserGetController = RouteController<Request<core.ParamsDictionary, {}, {}>>

export type UserLoggedInController = RouteController<Request<core.ParamsDictionary, {}, {}>>

export type UserUpdateLoggedInController = RouteController<Request<core.ParamsDictionary, {}, UpdateLoggedInBody>>

export type UserCreateController = RouteController<Request<core.ParamsDictionary, {}, CreateUserBody>>

export type UserReplaceController = RouteController<Request<ReplaceUserParams, {}, ReplaceUserBody>>

export type UserUpdateController = RouteController<Request<UpdateUserParams, {}, UpdateUserBody>>

export type UserListController = RouteController<Request<core.ParamsDictionary, {}, {}, ListUsersQuery>>

export type UserRemoveController = RouteController<Request<core.ParamsDictionary, {}, RemoveUserBody>>
