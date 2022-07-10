import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/user.controller'
import {authorize, ADMIN, SUPER_ADMIN} from '../../middlewares/auth'
import {updateLoggedIn, listUsers, createUser, replaceUser, updateUser} from '../../validations/user.validation'

const router = express.Router()

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load)


router
    .route('/')
    /**
     * @api {get} v1/users List Users
     * @apiDescription Get a list of users
     * @apiVersion 1.0.0
     * @apiName ListUsers
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {Number{1-}}         [page=1]     List page
     * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
     * @apiParam  {String}             [name]       User's name
     * @apiParam  {String}             [email]      User's email
     * @apiParam  {String=user,admin}  [role]       User's role
     * @apiParam  {String}             [isDeleted]  User's isDeleted
     *
     * @apiSuccess {Object[]} users List of users.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(authorize([SUPER_ADMIN, ADMIN]), validate(listUsers), controller.list)
    /**
     * @api {post} v1/users Create User
     * @apiDescription Create a new user
     * @apiVersion 1.0.0
     * @apiName CreateUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     *
     * @apiSuccess (Created 201) {String}  id         User's id
     * @apiSuccess (Created 201) {String}  name       User's name
     * @apiSuccess (Created 201) {String}  email      User's email
     * @apiSuccess (Created 201) {String}  role       User's role
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
    .post(authorize([SUPER_ADMIN, ADMIN]), validate(createUser), controller.create)


router
    .route('/profile')
    /**
     * @api {get} v1/users/profile Get User Profile
     * @apiDescription Get logged in user profile information
     * @apiVersion 1.0.0
     * @apiName GetUserProfile
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
     */
    .get(authorize(), controller.loggedIn)
    /**
     * @api {patch} v1/users/profile Update User Profile
     * @apiDescription Update logged in user profile information
     * @apiVersion 1.0.0
     * @apiName UpdateUserProfile
     * @apiGroup User
     * @apiPermission user
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(authorize(), validate(updateLoggedIn), controller.updateLoggedIn)

router
    .route('/:userId')
    /**
     * @api {get} v1/users/:id Get User
     * @apiDescription Get user information
     * @apiVersion 1.0.0
     * @apiName GetUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(authorize([ADMIN, SUPER_ADMIN]), validate(updateUser), controller.get)
    /**
     * @api {put} v1/users/:id Replace User
     * @apiDescription Replace the whole user document with a new one
     * @apiVersion 1.0.0
     * @apiName ReplaceUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .put(authorize([SUPER_ADMIN]), validate(replaceUser), controller.replace)
    /**
     * @api {patch} v1/users/:id Update User
     * @apiDescription Update some fields of a user document
     * @apiVersion 1.0.0
     * @apiName UpdateUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin,super-admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(authorize([SUPER_ADMIN]), validate(updateUser), controller.update)
    /**
     * @api {delete} v1/users/:id Delete User
     * @apiDescription Delete a user
     * @apiVersion 1.0.0
     * @apiName DeleteUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization   User's access token
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
     * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
     * @apiError (Not Found 404)    NotFound      User does not exist
     */
    .delete(authorize([SUPER_ADMIN]), controller.remove)


export default router
