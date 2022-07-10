import express from 'express'
import validate from 'express-validation'
import * as controller from '../../controllers/questions.controller'
import {authorize, ADMIN, SUPER_ADMIN} from '../../middlewares/auth'
import {listQuestions, createQuestion, replaceQuestion, updateQuestion} from '../../validations/questions.validation'

const router = express.Router()

/**
 * Load user when API with userId route parameter is hit
 */
router.param('questionId', controller.load)


router
    .route('/')
    .get(authorize([SUPER_ADMIN, ADMIN]), validate(listQuestions), controller.list)
    .post(validate(createQuestion), controller.create)

router
    .route('/:questionId')
    .get(authorize([ADMIN, SUPER_ADMIN]), validate(updateQuestion), controller.get)
    .put(authorize([SUPER_ADMIN]), validate(replaceQuestion), controller.replace)
    .patch(authorize([SUPER_ADMIN]), validate(updateQuestion), controller.update)
    .delete(authorize([SUPER_ADMIN]), controller.remove)


export default router
