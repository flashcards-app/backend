import nodemailer from 'nodemailer'
import {emailConfig, frontendUri} from '../../../config/vars'
import Email from 'email-templates'
import {google, gmail_v1} from 'googleapis'
import {env, enableEmail} from "../../../config/vars"

const productName = 'Fitness Hub'
const OAuth2      = google.auth.OAuth2

const myOAuth2Client = new OAuth2(
    emailConfig.emailClientId,
    emailConfig.emailClientSecret,
    emailConfig.emailRedirectUri
)


if (env === 'production' && enableEmail) {
    myOAuth2Client.setCredentials({
        refresh_token: emailConfig.emailRefreshToken
    })
}

const accessToken = (env === 'production' && enableEmail) ? myOAuth2Client.getAccessToken() : ''

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:    {
        type:         "OAuth2",
        user:         emailConfig.username,
        clientId:     emailConfig.emailClientId,
        clientSecret: emailConfig.emailClientSecret,
        refreshToken: emailConfig.emailRefreshToken,
        accessToken:  accessToken
    }
})

exports.sendPasswordReset = async (passwordResetObject) => {
    const email = new Email({
        views:   {root: __dirname},
        message: {
            from: emailConfig.emailDisplayAddress,
        },
        // uncomment below to send emails in development/test env:
        // send:      true,
        transport: transporter,
    })
    try {
        await email.send({
            template: 'passwordReset',
            message:  {
                subject: 'Password Reset',
                to:      passwordResetObject.userEmail,
            },
            locals:   {
                productName:      productName,
                passwordResetUrl: `${frontendUri}/resetPassword?resetToken=${passwordResetObject.resetToken}&email=${passwordResetObject.userEmail}`,
            },
        })
    } catch (error) {
        console.log('error sending password reset email')
    }
}

exports.sendPasswordChangeEmail = async (user) => {
    const email = new Email({
        views:   {root: __dirname},
        message: {
            from: emailConfig.emailDisplayAddress,
        },
        // uncomment below to send emails in development/test env:
        send:      true,
        transport: transporter,
    })
    try {
        await email.send({
            template: 'passwordChange',
            message:  {
                subject: 'Password Change',
                to:      user.email,
            },
            locals:   {
                productName: productName,
                name:        user.name,
            },
        })
    } catch (e) {
        console.log('error sending change password email, ', e)
    }
}
