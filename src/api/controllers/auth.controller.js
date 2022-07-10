import httpStatus from 'http-status'
import User from '../models/user.model'
import RefreshToken from '../models/refreshToken.model'
import PasswordResetToken from '../models/passwordResetToken.model'
import moment from 'moment-timezone'
import {jwtExpirationInterval} from '../../config/vars'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import emailProvider from '../services/emails/emailProvider'

/**
 * Returns a formatted object with tokens.
 * @param {Object} user
 * @param {String} accessToken
 * @private
 */
const generateTokenResponse = (user, accessToken) => {
    const tokenType    = 'Bearer'
    const refreshToken = RefreshToken.generate(user).token
    const expiresIn    = moment().add(jwtExpirationInterval, 'minutes')
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    }
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
const register = async (req, res, next) => {
    try {
        req.body.createdBy    = req.user._id
        req.body.updatedBy    = ''
        const userData        = omit(req.body, 'role')
        const user            = await new User(userData).save()
        const userTransformed = user.transform()
        const token           = generateTokenResponse(user, user.token())
        res.status(httpStatus.CREATED)
        return res.json({token, user: userTransformed})
    } catch (error) {
        return next(User.checkDuplicateEmail(error))
    }
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
const login = async (req, res, next) => {
    try {
        const {user, accessToken} = await User.findAndGenerateToken(req.body)
        const token               = generateTokenResponse(user, accessToken)
        const userTransformed     = user.transform()

        return res.json({token, user: userTransformed})
    } catch (error) {
        return next(error)
    }
}

/**
 * logout a user for given email and refresh token
 * @public
 */
const logout = async (req, res, next) => {
    try {
        const {email, refreshToken} = req.body
        const refreshObject         = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token:     refreshToken
        })
        return res.json(refreshObject).message('logout performed successfully')
    } catch (error) {
        return next(error)
    }
}

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
const oAuth = async (req, res, next) => {
    try {
        const {user}          = req
        const accessToken     = user.token()
        const token           = generateTokenResponse(user, accessToken)
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
const refresh = async (req, res, next) => {
    try {
        const {email, refreshToken} = req.body
        const refreshObject         = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token:     refreshToken,
        })
        const {user, accessToken}   = await User.findAndGenerateToken({email, refreshObject})
        const response              = generateTokenResponse(user, accessToken)
        return res.json(response)
    } catch (error) {
        return next(error)
    }
}

const sendPasswordReset = async (req, res, next) => {
    try {
        const {email} = req.body
        const user    = await User.findOne({email}).exec()

        if (user) {
            const passwordResetObj = await PasswordResetToken.generate(user)
            emailProvider.sendPasswordReset(passwordResetObj)
            res.status(httpStatus.OK)
            return res.json('success')
        }
        throw new APIError({
            status:  httpStatus.UNAUTHORIZED,
            message: 'No account found with that email',
        })
    } catch (error) {
        return next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const {email, password, resetToken} = req.body
        const resetTokenObject              = await PasswordResetToken.findOneAndRemove({
            userEmail: email,
            resetToken,
        })

        const err = {
            status:   httpStatus.UNAUTHORIZED,
            isPublic: true,
        }
        if (!resetTokenObject) {
            err.message = 'Cannot find matching reset token'
            throw new APIError(err)
        }
        if (moment().isAfter(resetTokenObject.expires)) {
            err.message = 'Reset token is expired'
            throw new APIError(err)
        }

        const user    = await User.findOne({email: resetTokenObject.userEmail}).exec()
        user.password = password
        await user.save()
        emailProvider.sendPasswordChangeEmail(user)

        res.status(httpStatus.OK)
        return res.json('Password Updated')
    } catch (error) {
        return next(error)
    }
}

export default {
    generateTokenResponse, resetPassword, sendPasswordReset, register, oAuth, login, logout, refresh
}
