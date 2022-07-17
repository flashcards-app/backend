import mongoose, {Document, Model} from "mongoose"
import {IGenericDocument, Timestamp, UpdateHistory} from "./index"
import APIError from "../../api/utils/APIError";
import {IRefreshTokenDoc} from "./RefreshToken";

export type RolesOptions = 'user' | 'admin' | 'super-admin'

export interface IUser extends IGenericDocument {
    email: string
    password: string
    name?: string
    services: {
        facebook?: string
        google?: string
    }
    role: 'user' | 'admin' | 'super-admin'
    picture?: string
    updateHistory: UpdateHistory
}

export interface TransformedUser {
    isDeleted: boolean
    id: string
    name: string
    email: string
    picture: string
    role: RolesOptions
    createdAt: string | Date
}

export interface IUserDoc extends IUser, Document, Timestamp {
    transform(): TransformedUser

    token(): string

    passwordMatches(password: string): Promise<boolean>
}

export interface IUserModel extends Model<IUserDoc> {
    roles: RolesOptions[]

    get(id: mongoose.Types.ObjectId): Promise<IUserDoc>

    findAndGenerateToken(options: { email?: string, password?: string, refreshObject?: (IRefreshTokenDoc & {_id: mongoose.Types.ObjectId}) | null }): Promise<{ user: IUserDoc, accessToken: string }>

    list({page, perPage, name, email, role, isDeleted}: {page?: string, perPage?: string, name?: string, email?: string, role?: string, isDeleted?: string}): Promise<IUserDoc[]>

    checkDuplicateEmail(error: Error): Error | APIError

    oAuthLogin({service, id, email, name, picture}: { service: 'facebook' | 'google', id: string, email: string, name: string, picture: string }): Promise<{ user: IUser, accessToken: string }>
}
