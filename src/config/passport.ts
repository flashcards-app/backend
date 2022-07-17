import {Strategy as JwtStrategy} from 'passport-jwt'
import BearerStrategy from 'passport-http-bearer'
import {ExtractJwt} from 'passport-jwt'
import {jwtSecret} from './vars'
import authProviders, {AuthProviderOptions} from '../api/services/authProviders'
import User from '../api/models/user.model'
import {IVerifyOptions} from "../@types/modules/passport-http-bearer";

export type DoneFunction = (error: any, user?: any, options?: IVerifyOptions | string) => void

const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
}

interface JWTPayload {
    sub: string
}

type JWTFunction = (payload: JWTPayload, done: DoneFunction) => void

const jwt: JWTFunction = async (payload, done) => {
    try {
        const user = await User.findById(payload.sub)
        if (user) {
            return done(null, user)
        }
        return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}

type OAuthFunction = (service: AuthProviderOptions) => (token: string, done: DoneFunction) => void

const oAuth: OAuthFunction = (service) => async (token, done) => {
    try {
        const userData = await authProviders[service](token)
        const user = await User.oAuthLogin(userData)
        return done(null, user)
    } catch (err) {
        return done(err)
    }
}

export default {
    jwt: new JwtStrategy(jwtOptions, jwt),
    facebook: new BearerStrategy(oAuth('facebook')),
    google: new BearerStrategy(oAuth('google')),
}
