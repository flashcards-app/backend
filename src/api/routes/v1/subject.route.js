import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/subjects.controller'
import {authorize, ADMIN, SUPER_ADMIN} from '../../middlewares/auth'
import {listSubjects, createSubject, replaceSubject, updateSubject, getSubject} from '../../validations/subjects.validation.js'

const router = express.Router()

/**
 * Load user when API with userId route parameter is hit
 */
router.param('subjectId', controller.load)


router
    .route('/')
    .get(authorize(),validate(listSubjects), controller.list)
    .post(authorize(),validate(createSubject), controller.create)

router
    .route('/:subjectId')
    .get(authorize([ADMIN, SUPER_ADMIN]), validate(getSubject), controller.get)
    .put(authorize([SUPER_ADMIN]), validate(replaceSubject), controller.replace)
    .patch(authorize([SUPER_ADMIN]), validate(updateSubject), controller.update)
    .delete(authorize([SUPER_ADMIN]), controller.remove)


export default router
