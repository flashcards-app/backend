export type UpdateQuestionBody = {
    isDeleted: boolean
    question: string
    answer: string
}


export type UpdateQuestionParams = {
    questionId: string
}


export type ListQuestionsQuery = {
    page: string
    perPage: string
    searchText: string
}


export type CreateQuestionBody = {
    question: string
    answer: string
}

export type ReplaceQuestionBody = {
    question: string
    answer: string
}


export type ReplaceQuestionParams = {
    questionId: string
}


export type RemoveQuestionBody = {
    isDeleted: boolean
}
