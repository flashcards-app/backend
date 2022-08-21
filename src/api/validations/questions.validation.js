import Joi from 'joi'
import {displayInOptions} from "../models/userQuestions.model";

// GET /v1/questions
export const listQuestions = {
    query: {
        page:    Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
    },
}

// GET /v1/questions/my
export const listLoggedIn = {
    query: {
        page:    Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
        subject: Joi.string().required(),
    },
}

export const addUserQuestion = {
    questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    displayIn:  Joi.string().valid(...displayInOptions).required(),
}

// POST /v1/questions
export const createQuestion = {
    body: {
        question: Joi.string().required(),
        answer:   Joi.string().required(),
        subject:  Joi.string().required()
    },
}


export const getQuestion = {
    params: {
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
}

// PUT /v1/questions/:questionId
export const replaceQuestion = {
    body:   {
        question: Joi.string().required(),
        answer:   Joi.string().required(),
        subject:  Joi.string().required()
    },
    params: {
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
}

// PATCH /v1/questions/:questionId
export const updateQuestion = {
    body:   {
        question: Joi.string().required(),
        answer:   Joi.string().required(),
        subject:  Joi.string().required()
    },
    params: {
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
}
