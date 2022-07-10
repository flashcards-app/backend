import express from 'express'
import validate from 'express-validation'
import controller from '../../controllers/auth.controller'
import {authorize, oAuth as oAuthLogin} from '../../middlewares/auth'
import {
    login,
    logout,
    register,
    oAuth,
    refresh,
    sendPasswordReset,
    passwordReset,
} from '../../validations/auth.validation'

const router = express.Router()

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission user
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 *
 * @apiSuccess (Created 201) {String}  token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
 * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in milliseconds
 * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
 *
 * @apiSuccess (Created 201) {String}  user.id         User's id
 * @apiSuccess (Created 201) {String}  user.name       User's name
 * @apiSuccess (Created 201) {String}  user.email      User's email
 * @apiSuccess (Created 201) {String}  user.role       User's role
 * @apiSuccess (Created 201) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/register')
    .post(validate(register), controller.register)


/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String{..128}}  password  User's password
 *
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in milliseconds
 *
 * @apiSuccess  {String}  user.id             User's id
 * @apiSuccess  {String}  user.name           User's name
 * @apiSuccess  {String}  user.email          User's email
 * @apiSuccess  {String}  user.role           User's role
 * @apiSuccess  {Date}    user.createdAt      Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/login')
    .post(validate(login), controller.login)


/**
 * @api {post} v1/auth/logout Logout
 * @apiDescription Logout a user
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup Auth
 * @apiPermission user
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/logout')
    .post(authorize(), validate(logout), controller.logout)

/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/refresh-token')
    .post(validate(refresh), controller.refresh)


router.route('/send-password-reset')
    .post(validate(sendPasswordReset), controller.sendPasswordReset)

router.route('/reset-password')
    .post(validate(passwordReset), controller.resetPassword)

/**
 * @api {post} v1/auth/facebook Facebook Login
 * @apiDescription Login with facebook. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName FacebookLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Facebook's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/facebook')
    .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

/**
 * @api {post} v1/auth/google Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in milliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/google')
    .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);


export default router;
