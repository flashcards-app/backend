import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { omitBy, isNil } from 'lodash'
import APIError from '../utils/APIError'

/**
 * Subjects Schema
 * @private
 */

const subjectsSchema = new mongoose.Schema({
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    label: {
        type: String,
        maxlength: 50,
    },
    title: {
        type: String,
        lowercase: true,
        unique:    true,
        trim:      true,
        maxlength: 50,
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String,
    },
    updateHistory: {
        type: Object,
        default: [],
    }
}, {
    timestamps: true,
})

subjectsSchema.pre('save', async function save(next) {
    try {
        this.title = this.label

        return next()
    } catch (error) {
        return next(error)

    }
})

subjectsSchema.method({
    transform() {
        const transformed = {}
        const fields = ['id', 'isDeleted', 'label', 'title', 'createdAt']

        fields.forEach((field) => {
            transformed[field] = this[field]
        })

        return transformed
    },
})

subjectsSchema.statics = {

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
                status: httpStatus.NOT_FOUND,
            })
        } catch (error) {
            throw error
        }
    },

     /**
     * List questions in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of questions to be skipped.
     * @param {number} limit - Limit number of questions to be returned.
     * @returns {Promise<Subject[]>}
     */
    list({ page = 1, perPage = 30, title, isDeleted = false }) {
        // name !== '' && name ? name = { "$regex": name, "$options": "i" } : ''
        const options = omitBy({ title, isDeleted }, isNil)

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec()
    },
}


/**
 * @typedef Subject
 */
export default mongoose.model('Subjects', subjectsSchema)
