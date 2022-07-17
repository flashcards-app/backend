import path from 'path'
import dotenv from 'dotenv-safe'

// import .env variables
if (process.env.NODE_ENV === 'development') {
    dotenv.config({
        path: path.join(__dirname, '../../.env'),
        sample: path.join(__dirname, '../../.env.example'),
    })
}


const env = process.env.NODE_ENV
const port = process.env.PORT || 8080
const jwtSecret = process.env.JWT_SECRET as string
const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES
const jwtRefreshTokenExpirationInterval = process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS
const frontendUri = process.env.FRONTEND_URI
const mongo = {
    uri: (process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI) as string,
}
const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
const emailConfig = {
    productName: process.env.PRODUCT_NAME,
    username: process.env.EMAIL_USERNAME,
    emailDisplayAddress: process.env.EMAIL_DISPLAY_ADDRESS,
    emailClientId: process.env.EMAIL_CLIENT_ID,
    emailClientSecret: process.env.EMAIL_CLIENT_SECRET,
    emailRefreshToken: process.env.EMAIL_REFRESH_TOKEN,
    emailRedirectUri: process.env.EMAIL_REDIRECT_URI
}

export {
    env,
    port,
    jwtSecret,
    jwtExpirationInterval,
    jwtRefreshTokenExpirationInterval,
    frontendUri,
    mongo,
    logs,
    emailConfig
}
