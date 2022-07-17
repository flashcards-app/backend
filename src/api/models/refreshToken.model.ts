import mongoose, {Model} from 'mongoose'
import crypto from 'crypto'
import moment from 'moment-timezone'
import {jwtRefreshTokenExpirationInterval} from '../../config/vars'
import {IUser, IUserDoc, IUserModel} from "../../@types/models/user";
import {IRefreshToken, IRefreshTokenDoc, IRefreshTokenModel} from "../../@types/models/RefreshToken";

const refreshTokenSchemaFields: Record<keyof IRefreshToken, any> = {
    token: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userEmail: {
        type: String,
        ref: 'User',
        required: true,
    },
    expires: {type: Date},
}

const refreshTokenSchema = new mongoose.Schema(refreshTokenSchemaFields)

refreshTokenSchema.statics = {
    /**
     * Generate a refresh token object and saves it into the database
     *
     * @param {User} user
     * @returns {RefreshToken}
     */
    generate(user) {
        const userId = user._id
        const userEmail = user.email
        const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`
        const expires = moment().add(jwtRefreshTokenExpirationInterval, 'days').toDate()
        const tokenObject = new this({
            token, userId, userEmail, expires,
        })
        tokenObject.save()
        return tokenObject
    }
}


export default mongoose.model<IRefreshTokenDoc, IRefreshTokenModel>('RefreshToken', refreshTokenSchema)
