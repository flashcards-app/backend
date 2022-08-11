import path from 'path'
import env from 'dotenv-safe'

// import .env variables
if (process.env.NODE_ENV === 'development') {
    env.load({
        path:   path.join(__dirname, '../../.env'),
        sample: path.join(__dirname, '../../.env.example'),
    })
}

module.exports = {
    env:                               process.env.NODE_ENV,
    port:                              process.env.PORT || 8080,
    jwtSecret:                         process.env.JWT_SECRET,
    jwtExpirationInterval:             process.env.JWT_EXPIRATION_MINUTES,
    jwtRefreshTokenExpirationInterval: process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS,
    frontendUri:                       process.env.FRONTEND_URI,
    gcsProject:                        process.env.GCLOUD_PROJECT,
    gcsKeyFile:                        process.env.GCS_KEYFILE,
    gcsBucket:                         process.env.GCS_BUCKET,
    mongo:                             {
        uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
    },
    mfpApiUri:                         process.env.MFP_API_URI,
    logs:                              process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    enableEmail:                       false,
    emailConfig:                       {
        productName:         process.env.PRODUCT_NAME,
        username:            process.env.EMAIL_USERNAME,
        emailDisplayAddress: process.env.EMAIL_DISPLAY_ADDRESS,
        emailClientId:       process.env.EMAIL_CLIENT_ID,
        emailClientSecret:   process.env.EMAIL_CLIENT_SECRET,
        emailRefreshToken:   process.env.EMAIL_REFRESH_TOKEN,
        emailRedirectUri:    process.env.EMAIL_REDIRECT_URI
    },
}
