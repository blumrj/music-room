import { Router } from 'express'
import ctrl from '../controllers/auth.controller.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

router.post('/login', asyncHandler(ctrl.login))
router.post('/logout', asyncHandler(ctrl.logout))
router.get('/me', asyncHandler(ctrl.me))

export default router
