import mongoose, {Document, Model} from "mongoose"
import {IGenericDocument, Timestamp, UpdateHistory} from "./index"
import APIError from "../../api/utils/APIError";
import {IRefreshTokenDoc} from "./RefreshToken";

export interface IQuestion extends IGenericDocument {
    question: string
    answer: string
    updateHistory: UpdateHistory
}

export interface TransformedQuestion {
    isDeleted: boolean
    id: string
    question: string
    answer: string
    createdAt: string | Date
}

export interface IQuestionDoc extends IQuestion, Document, Timestamp {
    transform(): TransformedQuestion
}

export interface IQuestionModel extends Model<IQuestionDoc> {
    get(id: mongoose.Types.ObjectId): Promise<IQuestionDoc>

    findAndGenerateToken(options: { email?: string, password?: string, refreshObject?: (IRefreshTokenDoc & {_id: mongoose.Types.ObjectId}) | null }): Promise<{ user: IQuestionDoc, accessToken: string }>

    list({page, perPage, name, email, role, isDeleted}: {page?: string, perPage?: string, name?: string, email?: string, role?: string, isDeleted?: string}): Promise<IQuestionDoc[]>

    checkDuplicateEmail(error: Error): Error | APIError
}
