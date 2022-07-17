import mongoose from "mongoose";
import {IUser} from "./user";


export interface IPasswordResetToken {
    resetToken: string
    userId: mongoose.Types.ObjectId
    userEmail: string
    expires: string | Date
}

export interface IPasswordResetTokenDoc extends IPasswordResetToken, mongoose.Document {

}

export interface IPasswordResetTokenModel extends mongoose.Model<IPasswordResetTokenDoc> {
    generate(user: IUser): IPasswordResetToken
}
