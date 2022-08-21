import mongoose from 'mongoose'
import httpStatus from 'http-status'
import {omitBy, isNil} from 'lodash'
import APIError from '../utils/APIError'
import Questions from './questions.model'

export const displayInOptions = ['minute', 'day', 'week', 'never']

const userQuestionSchema = new mongoose.Schema({
    id:                  {
        type:     String,
        required: true
    },
    subject:             {
        type:     String,
        required: true
    },
    displayIn:           {
        type:     String,
        enum:     displayInOptions,
        required: true
    },
    shouldBeDisplayedIn: {
        type:     String,
        required: true
    }
}, {
    timestamps: true
})

/**
 * Subjects Schema
 * @private
 */
const userQuestionsSchema = new mongoose.Schema({
    isDeleted: {
        type:     Boolean,
        required: true,
        default:  false,
    },
    questions: {
        type:     [userQuestionSchema],
        required: true
    }
}, {
    timestamps: true,
})

userQuestionsSchema.method({
    transform() {
        const transformed = {}
        const fields      = ['id', 'isDeleted', 'questions', 'createdAt']

        fields.forEach((field) => {
            transformed[field] = this[field]
        })

        return transformed
    },
})

userQuestionsSchema.statics = {
    /**
     * Get subject
     * @param {ObjectId} id - The objectId of subject.
     * @returns {Promise<Subject, APIError>}
     */
    async get(title) {
        try {
            let question

            if (mongoose.Types.ObjectId.isValid(title)) {
                question = await this.findOne({title}).exec()
            }
            if (question) {
                return question
            }

            throw new APIError({
                message: 'Question does not exist',
                status:  httpStatus.NOT_FOUND,
            })
        } catch (error) {
            throw error
        }
    },


    async addQuestion(userId, question) {
        try {
            return await this.findOneAndUpdate(
                {'_id': userId},
                {'$addToSet': {'questions': question}}).exec()
        } catch (error) {
            throw error
        }
    },

    /**
     * List questions in descending order of 'createdAt' timestamp.
     * @param {string} userId - The user id.
     * @returns {string} subject - The subject to filter by.
     * @param {number} skip - Number of questions to be skipped.
     * @param {number} limit - Limit number of questions to be returned.
     * @returns {Promise<Subject[]>}
     */
    async listUserQuestions(userId, {page = 1, perPage = 2, subject, isDeleted = false}) {
        const options = omitBy({isDeleted, subject}, isNil)
        const now     = new Date().toISOString()

        const userQuestions = await this.aggregate([
            {'$match': {'_id': userId}},
            {'$unwind': {'path': '$questions'}},
            {'$match': {'questions.shouldBeDisplayedIn': {'$gt': now}}},
            {'$match': {'questions.subject': subject}},
            {'$sort': {'questions.createdAt': -1}},
            {'$project': {'questions': 1}},
        ])

        const userQuestionsIds = userQuestions.map(userQuestion => userQuestion.questions.id)

        if (userQuestionsIds.length > 0) options._id = {"$nin": userQuestionsIds}

        return await Questions.find(options)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec()
    },
}


/**
 * @typedef Subject
 */
export default mongoose.model('UserQuestions', userQuestionsSchema)
