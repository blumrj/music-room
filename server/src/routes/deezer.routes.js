import { Router } from 'express'
import ctrl from '../controllers/deezer.controller.js'
import asyncHandler from '../middleware/asyncHandler.js'

const router = Router()

router.get('/search', asyncHandler(ctrl.search))

export default router
