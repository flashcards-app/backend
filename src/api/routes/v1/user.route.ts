import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/user.controller'
import {authorize, ADMIN, SUPER_ADMIN} from '../../middlewares/auth'
import {
    updateLoggedIn,
    listUsers,
    createUser,
    replaceUser,
    updateUser,
    removeUser
} from '../../validations/user.validation'

const router = express.Router()

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load)


router
    .route('/')
    .get(authorize([SUPER_ADMIN, ADMIN]), validate(listUsers), controller.list)
    .post(authorize([SUPER_ADMIN, ADMIN]), validate(createUser), controller.create)


router
    .route('/profile')
    .get(authorize(), controller.loggedIn)
    .patch(authorize(), validate(updateLoggedIn), controller.updateLoggedIn)

router
    .route('/:userId')
    .get(authorize([ADMIN, SUPER_ADMIN]), validate(updateUser), controller.get)
    .put(authorize([SUPER_ADMIN]), validate(replaceUser), controller.replace)
    .patch(authorize([SUPER_ADMIN]), validate(updateUser), controller.update)
    .delete(authorize([SUPER_ADMIN]), validate(removeUser), controller.remove)


export default router
