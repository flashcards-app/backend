import httpStatus from 'http-status'
import APIError from '../utils/APIError'
import Questions from '../models/questions.model'
import {
    QuestionCreateController,
    QuestionGetController, QuestionListController,
    QuestionLoadParamController, QuestionRemoveController, QuestionReplaceController, QuestionUpdateController
} from "../../@types/controllers/questions";
import {IQuestionDoc} from "../../@types/models/questions";
import {NextFunction, Request} from "express";

/**
 * Load question and append to req.
 * @public
 */
export const load: QuestionLoadParamController = async (req, res, next, id) => {
    try {
        const question = await Questions.get(id)
        req.locals = {question}
        return next()
    } catch (error) {
        return next(error)
    }
}

/**
 * Get question
 * @public
 */
export const get: QuestionGetController = (req, res, next) => {
    if (req.locals.question?.isDeleted) {
        if (req.user.role === 'admin' || req.user.role === 'super-admin') {
            res.json(req.locals.question?.transform())
        }

        return next(new APIError({
            message: 'this item is deleted',
            status: httpStatus.FORBIDDEN,
            errors: [{
                message: 'you don\'t have the right permissions to watch deleted items'
            }]
        }))
    }

    res.json(req.locals.question?.transform())
}

/**
 * Create new question
 * @public
 */
export const create: QuestionCreateController = async (req, res, next) => {
    try {
        const question = new Questions(req.body)
        const savedQuestion = await question.save()
        res.json(savedQuestion.transform()).status(httpStatus.CREATED)
    } catch (error) {
        return next(error)
    }
}

/**
 * Replace existing question
 * @public
 */
export const replace: QuestionReplaceController = async (req, res, next) => {
    try {
        const {question} = req.locals as { question: IQuestionDoc }
        const newQuestion = new Questions(req.body)

        await question.updateOne(newQuestion, {override: true, upsert: true})
        const savedQuestion = await Questions.findById(question._id) as IQuestionDoc

        res.json(savedQuestion.transform())
    } catch (error) {
        return next(error)
    }
}

/**
 * Update existing question
 * @public
 */
export const update: QuestionUpdateController = async (req, res, next) => {
    const question = Object.assign(req.locals.question as IQuestionDoc, req.body)
    await logUpdateHistory(req, next)

    try {
        const savedQuestion = await question.save()
        res.json(savedQuestion.transform())
    } catch (error) {
        return next(error)
    }
}

const logUpdateHistory = async (req: Request, next: NextFunction) => {
    try {
        const {question} = req.locals as { question: IQuestionDoc }
        if (question.updatedBy !== '') {
            const lastUpdate = {
                updatedBy: question.updatedBy,
                updatedAt: question.updatedAt
            }
            question.updatedBy = req.user._id
            await Questions.findByIdAndUpdate(question._id, {'$push': {'updateHistory': lastUpdate}}, {
                new: true,
                safe: true
            }).exec()
        } else {
            question.updatedBy = req.user._id
        }
    } catch (error) {
        return next(error)
    }
}

/**
 * Get question list
 * @public
 */
export const list: QuestionListController = async (req, res, next) => {
    try {
        const questions = await Questions.list(req.query)
        const transformedQuestions = questions.map(question => question.transform())
        res.json(transformedQuestions)
    } catch (error) {
        return next(error)
    }
}

/**
 * Delete question
 * @public
 */
export const remove: QuestionRemoveController = async (req, res, next) => {
    const {question} = req.locals as { question: IQuestionDoc }
    question.isDeleted = req.body.isDeleted

    try {
        await question.save()
        res.status(httpStatus.NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}
