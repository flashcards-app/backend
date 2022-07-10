import Joi from 'joi'

// GET /v1/questions
export const listQuestions = {
    query: {
        page:    Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
    },
}

// POST /v1/questions
export const createQuestion = {
    body: {
        question: Joi.string().required(),
        answer:   Joi.string().required()
    },
}

// PUT /v1/questions/:questionId
export const replaceQuestion = {
    body:   {
        question: Joi.string().required(),
        answer:   Joi.string().required(),
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
    },
    params: {
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
}
