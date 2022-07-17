import httpStatus from 'http-status'
import passport, {Authenticator} from 'passport'
import User from '../models/user.model'
import APIError from '../utils/APIError'
import {IUserDoc, RolesOptions} from "../../@types/models/user"
import {NextFunction, Request, Response} from "express"

export const SUPER_ADMIN: 'super-admin' = 'super-admin'
export const ADMIN: 'admin' = 'admin'
export const LOGGED_USER: 'user' = 'user'

type LogIn = (user: IUserDoc, options: any) => void

type HandleJWTFunction<RequestPayload = Request,
    ResponsePayload = Response> = (req: RequestPayload, res: ResponsePayload, next: NextFunction, roles: RolesOptions[]) => (err: any, user: IUserDoc, info: any) => Promise<void>

const handleJWT: HandleJWTFunction = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info
    const logIn: LogIn = Promise.promisify(req.logIn)
    const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    })

    try {
        if (error || !user) {
            throw error
        }

        await logIn(user, {session: false})
    } catch (e) {
        return next(apiError)
    }

    if ((roles as unknown as RolesOptions) === LOGGED_USER) {
        if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
            apiError.status = httpStatus.FORBIDDEN
            apiError.message = 'Forbidden'
            return next(apiError)
        }
    } else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN
        apiError.message = 'Forbidden'
        return next(apiError)
    } else if (err || !user) {
        return next(apiError)
    }

    req.user = user

    return next()
}

type Authorize = (roles?: RolesOptions[]) => (req: Request, res: Response, next: NextFunction) => void

export const authorize: Authorize = (roles = User.roles) => (req, res, next) => {
    return passport.authenticate('jwt', {session: false}, handleJWT(req, res, next, roles))(req, res, next)
}

type OAuth = (service: string) => (req: Request, res: Response, next: NextFunction) => void

export const oAuth: OAuth = service => passport.authenticate(service, {session: false})
