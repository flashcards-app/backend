import {IUserDoc} from "../models/user";
import {IQuestionDoc} from "../models/questions";

declare module "express-serve-static-core" {
    export interface Request {
        locals: {
            user?: IUserDoc
            question?: IQuestionDoc
        }
        user: IUserDoc
    }
}
