import mongoose from "mongoose";
import {IUser} from "./user";


export interface IRefreshToken {
    token: string
    userId: mongoose.Types.ObjectId
    userEmail: string
    expires: string | Date
}

export interface IRefreshTokenDoc extends IRefreshToken, mongoose.Document {

}

export interface IRefreshTokenModel extends mongoose.Model<IRefreshTokenDoc> {
    generate(user: IUser): IRefreshToken
}
