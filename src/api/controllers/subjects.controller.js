import httpStatus from 'http-status'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import Subjects from '../models/subjects.model'

/**
 * Load user and append to req.
 * @public
 */
export const load = async (req, res, next, title) => {
    try {
        const user = await Subjects.get(title)
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
            res.json(req.locals.user.transform())
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
        res.json(req.locals.user.transform())
}
/**
 * Create new user
 * @public
 */
export const create = async (req, res, next) => {
    try {
        const question = new Subjects(req.body)
        const savedQuestion = await question.save()
        res.json(savedQuestion.transform()).status(httpStatus.CREATED)
    } catch (error) {
        // TODO:
        console.log(error)
    }
}

/**
 * Replace existing question
 * @public
 */
export const replace = async (req, res, next) => {
    try {
        const {user}        = req.locals
        const newUser       = new Subjects(req.body)
        const ommitRole     = user.role !== 'super-admin' ? 'role' : ''
        const newUserObject = omit(newUser.toObject(), '_id', ommitRole)

        await user.updateOne(newUserObject, {override: true, upsert: true})
        const savedUser = await Subjects.findById(user._id)

        res.json(savedUser.transform())
    } catch (error) {
        next(Subjects.checkDuplicateEmail(error))
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
        res.json(savedUser.transform())
    } catch (e) {
        next(Subjects.checkDuplicateEmail(e))
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
            Subjects.findByIdAndUpdate(req.body.id, {'$push': {'updateHistory': lastUpdate}}, {new: true, safe: true},
                (err, result) => {
                    if (err)
                        throw err
                })
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
        const subjects            = await Subjects.list(req.query)
        const transformedSubjects = subjects.map(subject => subject.transform())
        res.json(transformedSubjects)
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
