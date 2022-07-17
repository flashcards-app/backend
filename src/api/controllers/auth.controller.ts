import httpStatus from 'http-status'
import User from '../models/user.model'
import RefreshToken from '../models/refreshToken.model'
import PasswordResetToken from '../models/passwordResetToken.model'
import moment from 'moment-timezone'
import {jwtExpirationInterval} from '../../config/vars'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import emailProvider from '../services/emails/emailProvider'
import {IUser, IUserDoc} from "../../@types/models/user";
import {
    AuthLoginController,
    AuthLogoutController,
    AuthOAuthController,
    AuthRefreshController,
    AuthRegisterController,
    AuthResetPasswordController,
    AuthSendPasswordResetController
} from "../../@types/controllers/auth"
import {Timestamp} from "../../@types/models"
import {RegisterBody} from "../../@types/validations/auth"


const generateTokenResponse = async (user: IUser, accessToken: string) => {
    const tokenType = 'Bearer'

    const refreshTokenObject = await RefreshToken.generate(user)
    const refreshToken = refreshTokenObject.token
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes')
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    }
}


const register: AuthRegisterController = async (req, res, next) => {
    try {
        req.body = {
            ...req.body,
            createdBy: req.user._id,
            updatedBy: ''
        } as unknown as RegisterBody & Timestamp

        const userData = omit(req.body, 'role')
        const user = await new User(userData).save()
        const userTransformed = user.transform()
        const token = generateTokenResponse(user, user.token())
        res.status(httpStatus.CREATED)
        return res.json({token, user: userTransformed})
    } catch (error: any) {
        return next(User.checkDuplicateEmail(error))
    }
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
const login: AuthLoginController = async (req, res, next) => {
    try {
        const {user, accessToken} = await User.findAndGenerateToken(req.body)
        const token = generateTokenResponse(user, accessToken)
        const userTransformed = user.transform()

        return res.json({token, user: userTransformed})
    } catch (error) {
        return next(error)
    }
}

/**
 * logout a user for given email and refresh token
 * @public
 */
const logout: AuthLogoutController = async (req, res, next) => {
    try {
        const {email, refreshToken} = req.body
        await RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken
        })
        return res.status(httpStatus.NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
const oAuth: AuthOAuthController = async (req, res, next) => {
    try {
        const {user} = req
        const accessToken = user.token()
        const token = generateTokenResponse(user, accessToken)
        const userTransformed = user.transform()
        return res.json({token, user: userTransformed})
    } catch (error) {
        return next(error)
    }
}

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
const refresh: AuthRefreshController = async (req, res, next) => {
    try {
        const {email, refreshToken} = req.body
        const refreshObject = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken,
        })
        const {user, accessToken} = await User.findAndGenerateToken({email, refreshObject})
        const response = generateTokenResponse(user, accessToken)
        return res.json(response)
    } catch (error) {
        return next(error)
    }
}

const sendPasswordReset: AuthSendPasswordResetController = async (req, res, next) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email}).exec()

        if (user) {
            const passwordResetObj = await PasswordResetToken.generate(user)
            await emailProvider.sendPasswordReset(passwordResetObj)
            res.status(httpStatus.OK)
            return res.json('success')
        }
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'No account found with that email',
        })
    } catch (error) {
        return next(error)
    }
}

const resetPassword: AuthResetPasswordController = async (req, res, next) => {
    try {
        const {email, password, resetToken} = req.body
        const resetTokenObject = await PasswordResetToken.findOneAndRemove({
            userEmail: email,
            resetToken,
        })

        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
            message: ""
        }

        if (!resetTokenObject) {
            err.message = 'Cannot find matching reset token'
            throw new APIError(err)
        }
        if (moment().isAfter(resetTokenObject.expires)) {
            err.message = 'Reset token is expired'
            throw new APIError(err)
        }

        const user = await User.findOne({email: resetTokenObject.userEmail}).exec() as IUserDoc
        user.password = password
        await user.save()
        await emailProvider.sendPasswordChangeEmail(user)

        res.status(httpStatus.OK)
        return res.json('Password Updated')
    } catch (error) {
        return next(error)
    }
}

export default {
    generateTokenResponse, resetPassword, sendPasswordReset, register, oAuth, login, logout, refresh
}
