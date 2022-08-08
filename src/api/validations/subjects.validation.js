import Joi from 'joi'

// GET /v1/questions
export const listSubjects = {
    query: {
        page:    Joi.number().min(1),
        perPage: Joi.number().min(1).max(100),
    },
}

// POST /v1/questions
export const createSubject = {
    body: {
        label: Joi.string().required(),
    },
}


export const getSubject = {
    params: {
        subjectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
}

// PUT /v1/questions/:questionId
export const replaceSubject = {
    body:   {
        label: Joi.string().required(),
    },
    params: {
        subjectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
}

// PATCH /v1/questions/:questionId
export const updateSubject = {
    body:   {
        label: Joi.string().required()
    },
    params: {
        subjectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
}
