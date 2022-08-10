import httpStatus from 'http-status'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import User from '../models/user.model'

/**
 * Load user and append to req.
 * @public
 */
export const load = async (req, res, next, id) => {
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
export const get = (req, res, next) => {
    if (req.locals.user.isDeleted === true) {
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            return res.json(req.locals.user.transform())
        } else {
            return next(new APIError({
                message: 'this item is deleted',
                status:  httpStatus.FORBIDDEN,
                errors:  [{
                    message: 'you don\'t have the right permissions to watch deleted items'
                }]
            }))
        }
    } else
        return res.json(req.locals.user.transform())
}

/**
 * Get logged in user info
 * @public
 */
export const loggedIn = (req, res,) => res.json(req.user.transform())

export const updateLoggedIn = async (req, res) => {
    const omitRole    = req.user.role !== 'super-admin' ? ['role', 'isDeleted'] : ''
    const updatedUser = omit(req.body, omitRole)
    const user        = Object.assign(req.user, updatedUser)
    req.locals        = {user: req.user}
    await logUpdateHistory(req)

    try {
        const savedUser = await user.save()
        return res.json(savedUser.transform())
    } catch (error) {
        throw error
    }
}

/**
 * Create new user
 * @public
 */
export const create = async (req, res, next) => {
    try {
        req.body.createdBy = req.user._id
        req.body.updatedBy = ''
        if (req.user.role !== 'super-admin')
            req.body.role = 'user'
        const user = new User(req.body)
        const savedUser = await user.save()
        return res.json(savedUser.transform()).status(httpStatus.CREATED)
    } catch (error) {
        next(User.checkDuplicateEmail(error))
    }
}

/**
 * Replace existing user
 * @public
 */
export const replace = async (req, res, next) => {
    try {
        const {user}        = req.locals
        const newUser       = new User(req.body)
        const ommitRole     = user.role !== 'super-admin' ? 'role' : ''
        const newUserObject = omit(newUser.toObject(), '_id', ommitRole)

        await user.updateOne(newUserObject, {override: true, upsert: true})
        const savedUser = await User.findById(user._id)

        return res.json(savedUser.transform())
    } catch (error) {
        next(User.checkDuplicateEmail(error))
    }
}

/**
 * Update existing user
 * @public
 */
export const update = async (req, res, next) => {
    if (req.user.role !== 'super-admin')
        req.body.role = 'user'
    const user = Object.assign(req.locals.user, req.body)
    await logUpdateHistory(req)

    try {
        const savedUser = await user.save()
        return res.json(savedUser.transform())
    } catch (e) {
        next(User.checkDuplicateEmail(e))
    }
}

const logUpdateHistory = async (req) => {
    try {
        if (req.locals.user.updatedBy !== '') {
            const lastUpdate          = {
                updatedBy: req.locals.user.updatedBy,
                updatedAt: req.locals.user.updatedAt
            }
            req.locals.user.updatedBy = req.user._id
            await User.findByIdAndUpdate(req.body.id, {'$push': {'updateHistory': lastUpdate}}, {new: true, safe: true}).exec()
        } else {
            req.locals.user.updatedBy = req.user._id
        }
    } catch (error) {
        throw error
    }
}

/**
 * Get user list
 * @public
 */
export const list = async (req, res, next) => {
    try {
        const users            = await User.list(req.query)
        const transformedUsers = users.map(user => user.transform())
        return res.json(transformedUsers)
    } catch (error) {
        next(error)
    }
}

/**
 * Delete user
 * @public
 */
export const remove = async (req, res, next) => {
    const {user}   = req.locals
    user.isDeleted = req.body.isDeleted

    try {
        await user.save()
        res.status(httpStatus.NO_CONTENT).end()
    } catch (e) {
        next(e)
    }
}
