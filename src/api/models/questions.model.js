import mongoose from 'mongoose'
import httpStatus from 'http-status'
import {omitBy, isNil} from 'lodash'
import APIError from '../utils/APIError'

/**
 * Question Schema
 * @private
 */
const questionsSchema = new mongoose.Schema({
    isDeleted:     {
        type:     Boolean,
        required: true,
        default:  false,
    },
    question: {
        type: String
    },
    answer: {
        type: String
    },
    createdBy:     {
        type: String,
    },
    updatedBy:     {
        type: String,
    },
    updateHistory: {
        type:    Object,
        default: [],
    }
}, {
    timestamps: true,
})


/**
 * Methods
 */
questionsSchema.method({
    transform() {
        const transformed = {}
        const fields      = ['isDeleted', 'question', 'answer', 'createdAt']

        fields.forEach((field) => {
            transformed[field] = this[field]
        })

        return transformed
    },
})

/**
 * Statics
 */
questionsSchema.statics = {
    /**
     * Get question
     *
     * @param {ObjectId} id - The objectId of question.
     * @returns {Promise<Question, APIError>}
     */
    async get(id) {
        try {
            let question

            if (mongoose.Types.ObjectId.isValid(id)) {
                question = await this.findById(id).exec()
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

    /**
     * List questions in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of questions to be skipped.
     * @param {number} limit - Limit number of questions to be returned.
     * @returns {Promise<Question[]>}
     */
    list({page = 1, perPage = 30, name, email, role, isDeleted = false}) {
        name !== '' && name ? name = {"$regex": name, "$options": "i"} : ''
        const options = omitBy({name, email, role, isDeleted}, isNil)

        return this.find(options)
            .sort({createdAt: -1})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec()
    },
}

/**
 * @typedef Question
 */
export default mongoose.model('Questions', questionsSchema)
