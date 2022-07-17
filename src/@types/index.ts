import {NextFunction, Request, Response} from "express";

export type ParamController<ParamType = any,
    RequestPayload = Request,
    ResponsePayload = Response> = (req: RequestPayload, res: ResponsePayload, next: NextFunction, param: ParamType) => void | (() => void) | Promise<any>

export type RouteController<RequestPayload = Request,
    ResponsePayload = Response> = (req: RequestPayload, res: ResponsePayload, next: NextFunction) => void


