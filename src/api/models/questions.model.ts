import mongoose from 'mongoose'
import httpStatus from 'http-status'
import {omitBy, isNil} from 'lodash'
import APIError from '../utils/APIError'
import {IQuestion, IQuestionDoc, IQuestionModel} from "../../@types/models/questions";

const questionsSchemaFields: Record<keyof IQuestion, any> = {
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    question: {
        type: String
    },
    answer: {
        type: String
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
}

const questionsSchema = new mongoose.Schema(questionsSchemaFields, {timestamps: true})



questionsSchema.method('transform', function () {
    const transformed: { [key: string]: any } = {}
    const fields = ['isDeleted', 'question', 'answer', 'createdAt']

    fields.forEach((field) => {
        transformed[field] = this[field]
    })

    return transformed
})


questionsSchema.statics.get = async function (id) {
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
            status: httpStatus.NOT_FOUND,
        })
    } catch (error) {
        throw error
    }
}


questionsSchema.statics.list = function ({page = 1, perPage = 30, searchText, isDeleted = false}) {
    if (searchText)
        searchText = {"$regex": searchText, "$options": "i"}

    const options = omitBy({question: searchText, isDeleted}, isNil)

    return this.find(options)
        .sort({createdAt: -1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec()
}


export default mongoose.model<IQuestionDoc, IQuestionModel>('Questions', questionsSchema)
