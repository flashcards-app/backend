Promise = require('bluebird') // make bluebird default Promise
import app from './config/express'
import {port} from './config/vars'
import mongoose from "./config/mongoose"

// open mongoose connection
(async () => await mongoose.connect())()


app.listen(port, () => {
    console.log(`app is running at port: ${port}`)
})

/**
 * Exports express
 * @public
 */
export default app


