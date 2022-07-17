import mongoose, {Error} from 'mongoose'
import httpStatus from 'http-status'
import {isNil, omitBy} from 'lodash'
import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'
import jwt from 'jwt-simple'
import {v4 as uuidv4} from 'uuid'
import APIError from '../utils/APIError'
import {env, jwtExpirationInterval, jwtSecret} from '../../config/vars'
import {IUser, IUserDoc, IUserModel, TransformedUser} from "../../@types/models/user"

export const roles = ['user', 'admin', 'super-admin']

const userSchemaFields: Record<keyof IUser, any> = {
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    services: {
        facebook: String,
        google: String,
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
    picture: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String,
    },
    updateHistory: {
        type: [{
            updatedBy: String,
            updatedAt: String
        }],
        default: [],
    }
}

const userSchema = new mongoose.Schema(userSchemaFields, {
    timestamps: true,
})


userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) {
            return next()
        }

        const rounds = env === 'test' ? 1 : 10

        this.password = await bcrypt.hash(this.password, rounds)

        return next()
    } catch (error: any) {
        return next(error)
    }
})


userSchema.method('transform', function () {
    const transformed:  {[key: string]: any} = {}
    const fields:(keyof TransformedUser)[] = [ 'id', 'name', 'email', 'picture', 'role', 'createdAt']

    fields.forEach((field) => {
        transformed[field] = this[field]
    })

    return transformed
})

userSchema.method('token', function () {
    const payload = {
        exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id,
    }

    return jwt.encode(payload, jwtSecret)
})

userSchema.method('passwordMatches', async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
})

userSchema.virtual('roles', roles)



userSchema.statics.get = async function (id) {
    try {
        let user

        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await this.findById(id).exec()
        }

        if (user) {
            return user
        }

        throw new APIError({
            message: 'User does not exist',
            status: httpStatus.NOT_FOUND,
        })
    } catch (error) {
        throw error
    }
}



userSchema.statics.findAndGenerateToken = async function (options) {
    const {email, password, refreshObject} = options
    if (!email) {
        throw new APIError({message: 'An email is required to generate a token', status: httpStatus.UNAUTHORIZED})
    }

    const user = await this.findOne({email}).exec()

    const err = {
        message: "",
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
    }


    if (user.isDeleted) {
        throw new APIError({
            status: httpStatus.FORBIDDEN,
            message: 'Account is disabled.'
        })
    }

    if (password) {
        if (user && await user.passwordMatches(password)) {
            return {user, accessToken: user.token()}
        }
        err.message = 'Incorrect email or password'
    } else if (refreshObject && refreshObject.userEmail === email) {
        if (moment(refreshObject.expires).isBefore()) {
            err.message = 'Invalid refresh token.'
        } else {
            return {user, accessToken: user.token()}
        }
    } else {
        err.message = 'Incorrect email or refreshToken'
    }
    throw new APIError(err)
}


userSchema.statics.list = async function ({page = 1, perPage = 30, name, email, role, isDeleted = false}) {
    name !== '' && name ? name = {"$regex": name, "$options": "i"} : ''
    const options = omitBy({name, email, role, isDeleted}, isNil)

    return await this.find(options)
        .sort({createdAt: -1})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec()
}


userSchema.statics.checkDuplicateEmail = (error) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        return new APIError({
            message: 'Validation Error',
            errors: [
                {
                    field: 'email',
                    location: 'body',
                    messages: ['"email" already exists'],
                },
            ],
            status: httpStatus.CONFLICT,
            isPublic: true,
            stack: error.stack,
        })
    }
    return error
}

userSchema.statics.oAuthLogin = async function ({service, id, email, name, picture}: { service: 'facebook' | 'google', id: string, email: string, name: string, picture: string }) {
    const user = await this.findOne({$or: [{[`services.${service}`]: id}, {email}]})
    if (user) {
        user.services[service] = id
        if (!user.name) {
            user.name = name
        }
        if (!user.picture) {
            user.picture = picture
        }
        return user.save()
    }
    const password = uuidv4()
    return this.create({
        services: {[service]: id}, email, password, name, picture,
    })
}

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)
export default User
