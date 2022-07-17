import httpStatus from 'http-status'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import User from '../models/user.model'
import {
    UserCreateController,
    UserGetController,
    UserListController,
    UserLoadParamController,
    UserLoggedInController,
    UserRemoveController,
    UserReplaceController,
    UserUpdateController,
    UserUpdateLoggedInController
} from "../../@types/controllers/user"
import {IUserDoc} from "../../@types/models/user"
import {CreateUserBody} from "../../@types/validations/user"
import {NextFunction, Request} from "express"

/**
 * Load user and append to req.
 * @public
 */
export const load: UserLoadParamController = async (req, res, next, id) => {
    try {
        const user = await User.get(id)
        req.locals = {user}
        return next()
    } catch (error) {
        return next(error)
    }
}

/**
 * Get user
 * @public
 */
export const get: UserGetController = (req, res, next) => {
    if (req.locals.user?.isDeleted) {
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            return res.json(req.locals.user?.transform())
        }

        return next(new APIError({
            message: 'this item is deleted',
            status: httpStatus.FORBIDDEN,
            errors: [{
                message: 'you don\'t have the right permissions to watch deleted items'
            }]
        }))
    }

    return res.json(req.locals.user?.transform())
}

/**
 * Get logged in user info
 * @public
 */
export const loggedIn: UserLoggedInController = (req, res) => res.json(req.user.transform())

export const updateLoggedIn: UserUpdateLoggedInController = async (req, res, next) => {
    const omitRole = req.user.role !== 'super-admin' ? ['role', 'isDeleted'] : ''
    const updatedUser = omit(req.body, omitRole)
    const user = Object.assign(req.user, updatedUser)
    req.locals = {user: req.user}
    await logUpdateHistory(req, next)

    try {
        const savedUser = await user.save()
        res.json(savedUser.transform())
    } catch (error) {
        return next(error)
    }
}

/**
 * Create new user
 * @public
 */
export const create: UserCreateController = async (req, res, next) => {
    try {
        req.body = {
            ...req.body,
            createdBy: req.user._id,
            updatedBy: ''
        } as CreateUserBody & { createdBy: string, updatedBy: string }

        if (req.user.role !== 'super-admin')
            req.body.role = 'user'

        const user = new User(req.body)
        const savedUser = await user.save()
        res.json(savedUser.transform()).status(httpStatus.CREATED)
    } catch (error: any) {
        next(User.checkDuplicateEmail(error))
    }
}

/**
 * Replace existing user
 * @public
 */
export const replace: UserReplaceController = async (req, res, next) => {
    try {
        const {user} = req.locals as {user: IUserDoc}
        const newUser = new User(req.body)
        const ommitRole = user.role !== 'super-admin' ? 'role' : ''
        const newUserObject = omit(newUser.toObject(), '_id', ommitRole)

        await user.updateOne(newUserObject, {override: true, upsert: true})
        const savedUser = await User.findById(user._id) as IUserDoc

        res.json(savedUser.transform())
    } catch (error: any) {
        next(User.checkDuplicateEmail(error))
    }
}

/**
 * Update existing user
 * @public
 */
export const update: UserUpdateController = async (req, res, next) => {
    if (req.user.role !== 'super-admin')
        req.body.role = 'user'
    const user = Object.assign(req.locals.user as IUserDoc, req.body)
    await logUpdateHistory(req, next)

    try {
        const savedUser = await user.save()
        res.json(savedUser.transform())
    } catch (error: any) {
        next(User.checkDuplicateEmail(error))
    }
}

const logUpdateHistory = async (req: Request, next: NextFunction) => {
    try {
        const {user} = req.locals as {user: IUserDoc}

        if (user.updatedBy !== '') {
            const lastUpdate = {
                updatedBy: req.locals.user?.updatedBy,
                updatedAt: req.locals.user?.updatedAt
            }

            user.updatedBy = req.user._id

            // @ts-ignore - type problem with mongoose.
            return await User.findByIdAndUpdate(user._id, {'$push': {'updateHistory': lastUpdate}}, {new: true, safe: true}).exec()
        }

        user.updatedBy = req.user._id
    } catch (error) {
        return next(error)
    }
}

/**
 * Get user list
 * @public
 */
export const list: UserListController = async (req, res, next) => {
    try {
        const users = await User.list(req.query)
        const transformedUsers = users.map(user => user.transform())
        res.json(transformedUsers)
    } catch (error) {
        return next(error)
    }
}

/**
 * Delete user
 * @public
 */
export const remove: UserRemoveController = async (req, res, next) => {
    const {user} = req.locals as {user: IUserDoc}
    user.isDeleted = req.body.isDeleted

    try {
        await user.save()
        res.status(httpStatus.NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}
