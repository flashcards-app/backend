Promise = require('bluebird') // make bluebird default Promise
import app from './config/express'
import {port} from './config/vars'
import mongoose from "./config/mongoose"

// open models connection
(async () => await mongoose.connect())()


app.listen(port, () => {
    console.log(`app is running at port: ${port}`)
})

/**
 * Exports express
 * @public
 */
export default app


// TODO: add explanation for how to work with editor config.
// TODO: add explanation for how to start working.
// TODO: add explanation on how to create a pull request and how to merge to fix conflicts.
