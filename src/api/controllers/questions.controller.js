import httpStatus from 'http-status'
import {omit} from 'lodash'
import APIError from '../utils/APIError'
import Questions from '../models/questions.model'

/**
 * Load question and append to req.
 * @public
 */
export const load = async (req, res, next, id) => {
    try {
        const question = await Questions.get(id)
        req.locals     = {question}
        return next()
    } catch (error) {
        return next(error)
    }
}

/**
 * Get question
 * @public
 */
export const get    = (req, res, next) => {
    if (req.locals.question.isDeleted === true) {
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            return res.json(req.locals.question.transform())
        }

        return next(new APIError({
            message: 'this item is deleted',
            status:  httpStatus.FORBIDDEN,
            errors:  [{
                message: 'you don\'t have the right permissions to watch deleted items'
            }]
        }))
    }

    return res.json(req.locals.question.transform())
}
/**
 * Create new question
 * @public
 */
export const create = async (req, res, next) => {
    try {
        req.body.createdBy    = req.user._id
        req.body.updatedBy    = ''
        const questions     = new Questions(req.body)
        const savedQuestion = await questions.save()
        return res.json(savedQuestion.transform()).status(httpStatus.CREATED)
    } catch (error) {
        next(error)
    }
}

/**
 * Replace existing question
 * @public
 */
export const replace = async (req, res, next) => {
    try {
        const {questions}   = req.locals
        const newQuestion   = new Questions(req.body)
        const ommitRole     = questions.role !== 'super-admin' ? 'role' : ''
        const newQuestionObject = omit(newQuestion.toObject(), '_id', ommitRole)

        await questions.updateOne(newQuestionObject, {override: true, upsert: true})
        const savedQuestion = await Questions.findById(questions._id)

        return res.json(savedQuestion.transform())
    } catch (error) {
        next(error)
    }
}

/**
 * Update existing question
 * @public
 */
export const update = async (req, res, next) => {
    const question = Object.assign(req.locals.question, req.body)
    await logUpdateHistory(req)

    try {
        const savedQuestion = await question.save()
        return res.json(savedQuestion.transform())
    } catch (error) {
        next(error)
    }
}

const logUpdateHistory = async (req) => {
    try {
        if (req.locals.question.updatedBy !== '') {
            const lastUpdate              = {
                updatedBy: req.locals.question.updatedBy,
                updatedAt: req.locals.question.updatedAt
            }
            req.locals.question.updatedBy = req.user._id
            await Questions.findByIdAndUpdate(req.body.id, {'$push': {'updateHistory': lastUpdate}},
                {new: true, safe: true}).exec()
        } else {
            req.locals.question.updatedBy = req.user._id
        }
    } catch (error) {
        throw error
    }
}

/**
 * Get question list
 * @public
 */
export const list = async (req, res, next) => {
    try {
        const questions            = await Questions.list(req.query)
        const transformedQuestions = questions.map(question => question.transform())
        return res.json(transformedQuestions)
    } catch (error) {
        next(error)
    }
}

/**
 * Delete question
 * @public
 */
export const remove = async (req, res, next) => {
    const {question}   = req.locals
    question.isDeleted = req.body.isDeleted

    try {
        await question.save()
        return res.status(httpStatus.NO_CONTENT).end()
    } catch (error) {
        next(error)
    }
}
