import {ParamController, RouteController} from "../index";
import mongoose from "mongoose";
import {Request} from "express";
import * as core from "express-serve-static-core";
import {
    CreateQuestionBody,
    ListQuestionsQuery,
    RemoveQuestionBody,
    ReplaceQuestionBody,
    ReplaceQuestionParams,
    UpdateQuestionBody,
    UpdateQuestionParams
} from "../validations/questions"

export type QuestionLoadParamController = ParamController<mongoose.Types.ObjectId>

export type QuestionGetController = RouteController<Request<core.ParamsDictionary, {}, {}>>

export type QuestionCreateController = RouteController<Request<core.ParamsDictionary, {}, CreateQuestionBody>>

export type QuestionReplaceController = RouteController<Request<ReplaceQuestionParams, {}, ReplaceQuestionBody>>

export type QuestionUpdateController = RouteController<Request<UpdateQuestionParams, {}, UpdateQuestionBody>>

export type QuestionListController = RouteController<Request<core.ParamsDictionary, {}, {}, ListQuestionsQuery>>

export type QuestionRemoveController = RouteController<Request<core.ParamsDictionary, {}, RemoveQuestionBody>>
