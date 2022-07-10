import mongoose from 'mongoose'
import logger from './../config/logger'
import {mongo, env} from './vars'

// set mongoose Promise to Bluebird
mongoose.Promise = Promise

// Exit application on error
mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`)
    process.exit(-1)
})

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true)
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public

 */
export default {
    connect: async () => {
        try {
            await mongoose.connect(mongo.uri, {
                useCreateIndex:     true,
                keepAlive:          1,
                useNewUrlParser:    true,
                useUnifiedTopology: true,
                useFindAndModify:   false,
            })

            console.log('mongoDB connected...')
            return mongoose.connection
        } catch (error) {
            console.error(error)
        }
    },
}
