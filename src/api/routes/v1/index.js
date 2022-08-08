import express from 'express'
import authRoutes from './auth.route'
import userRoute from './user.route'
import questionsRoute from './question.route'
import subjectsRoute from './subject.route'

const router = express.Router()
/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'))

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'))

router.use("/auth", authRoutes)
router.use("/users", userRoute)
router.use("/questions", questionsRoute)
router.use("/subjects", subjectsRoute)

export default router
