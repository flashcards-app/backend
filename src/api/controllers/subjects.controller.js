import httpStatus from 'http-status'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import Subjects from '../models/subjects.model'

/**
 * Load subject` and append to req.
 * @public
 */
export const load = async (req, res, next, title) => {
    try {
        const subject = await Subjects.get(title)
        req.locals    = {subject}
        return next()
    } catch (error) {
        return next(error)
    }
}

/**
 * Get subject
 * @public
 */
export const get    = (req, res, next) => {
    if (req.locals.subject.isDeleted === true) {
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            return res.json(req.locals.subject.transform())
        }
        return next(new APIError({
            message: 'this item is deleted',
            status:  httpStatus.FORBIDDEN,
            errors:  [{
                message: 'you don\'t have the right permissions to watch deleted items'
            }]
        }))
    }

    return res.json(req.locals.subject.transform())
}

/**
 * Create new subject
 * @public
 */
export const create = async (req, res, next) => {
    try {
        req.body.createdBy    = req.user._id
        req.body.updatedBy    = ''
        const subject      = new Subjects(req.body)
        const savedSubject = await subject.save()
        return res.json(savedSubject.transform()).status(httpStatus.CREATED)
    } catch (error) {
        // TODO:
        console.log(error)
    }
}

/**
 * Replace existing subject
 * @public
 */
export const replace = async (req, res, next) => {
    try {
        const {subject}        = req.locals
        const newSubject       = new Subjects(req.body)
        const ommitRole        = subject.role !== 'super-admin' ? 'role' : ''
        const newSubjectObject = omit(newSubject.toObject(), '_id', ommitRole)

        await subject.updateOne(newSubjectObject, {override: true, upsert: true})
        const savedSubject = await Subjects.findById(subject._id)

        return res.json(savedSubject.transform())
    } catch (error) {
        next(error)
    }
}

/**
 * Update existing subject
 * @public
 */
export const update = async (req, res, next) => {
    if (req.user.role !== 'super-admin')
        req.body.role = 'user'
    const subject = Object.assign(req.locals.subject, req.body)
    await logUpdateHistory(req)

    try {
        const savedSubject = await subject.save()
        return res.json(savedSubject.transform())
    } catch (error) {
        next(error)
    }
}

const logUpdateHistory = async (req) => {
    try {
        if (req.locals.subject.updatedBy !== '') {
            const lastUpdate             = {
                updatedBy: req.locals.subject.updatedBy,
                updatedAt: req.locals.subject.updatedAt
            }
            req.locals.subject.updatedBy = req.user._id
            await Subjects.findByIdAndUpdate(req.body.id, {'$push': {'updateHistory': lastUpdate}}, {
                new: true, safe: true
            }).exec()
        } else {
            req.locals.subject.updatedBy = req.user._id
        }
    } catch (error) {
        throw error
    }
}

/**
 * Get subject list
 * @public
 */
export const list = async (req, res, next) => {
    try {
        const subjects            = await Subjects.list(req.query)
        const transformedSubjects = subjects.map(subject => subject.transform())
        return res.json(transformedSubjects)
    } catch (error) {
        next(error)
    }
}

/**
 * Delete subject
 * @public
 */
export const remove = async (req, res, next) => {
    const {subject}   = req.locals
    subject.isDeleted = req.body.isDeleted

    try {
        await subject.save()
        res.status(httpStatus.NO_CONTENT).end()
    } catch (e) {
        next(e)
    }
}
