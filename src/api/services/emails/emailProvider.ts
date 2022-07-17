import nodemailer from 'nodemailer'
import {emailConfig, frontendUri} from '../../../config/vars'
import Email from 'email-templates'
import {google} from 'googleapis'
import {env} from "../../../config/vars"
import {IUser} from "../../../@types/models/user";

const productName = 'Fitness Hub'
const OAuth2 = google.auth.OAuth2

const myOAuth2Client = new OAuth2(
    emailConfig.emailClientId,
    emailConfig.emailClientSecret,
    emailConfig.emailRedirectUri
)


if (env === 'production')
    myOAuth2Client.setCredentials({
        refresh_token: emailConfig.emailRefreshToken
    })

const accessToken = env === 'production' ? myOAuth2Client.getAccessToken() : ''

const transporter = nodemailer.createTransport({
// @ts-ignore - types are not compatible with the documentation
    auth: {
        type: "OAuth2",
        user: emailConfig.username,
        clientId: emailConfig.emailClientId,
        clientSecret: emailConfig.emailClientSecret,
        refreshToken: emailConfig.emailRefreshToken,
        accessToken,
    }
})

type SendPasswordReset = (passwordResetObject: { userEmail: string, resetToken: string }) => Promise<void>

export const sendPasswordReset: SendPasswordReset = async (passwordResetObject) => {
    const email = new Email({
        views: {root: __dirname},
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
            message: {
                subject: 'Password Reset',
                to: passwordResetObject.userEmail,
            },
            locals: {
                productName: productName,
                passwordResetUrl: `${frontendUri}/resetPassword?resetToken=${passwordResetObject.resetToken}&email=${passwordResetObject.userEmail}`,
            },
        })
    } catch (error) {
        console.log('error sending password reset email')
    }
}


export const sendPasswordChangeEmail = async (user: IUser): Promise<void> => {
    const email = new Email({
        views: {root: __dirname},
        message: {
            from: emailConfig.emailDisplayAddress,
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transporter,
    })
    try {
        await email.send({
            template: 'passwordChange',
            message: {
                subject: 'Password Change',
                to: user.email,
            },
            locals: {
                productName: productName,
                name: user.name,
            },
        })
    } catch (e) {
        console.log('error sending change password email, ', e)
    }
}

const emailProvider = {
    sendPasswordReset,
    sendPasswordChangeEmail
}

export default emailProvider
