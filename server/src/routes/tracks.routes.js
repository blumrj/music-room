import { Router } from 'express'
import ctrl from '../controllers/tracks.controller.js'
import asyncHandler from '../middleware/asyncHandler.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.get('/', asyncHandler(ctrl.listTracks))
router.get('/:id/preview-url', asyncHandler(ctrl.getPreviewUrl))
router.post('/', requireAuth, asyncHandler(ctrl.addTrack))
router.delete('/:id', requireAuth, asyncHandler(ctrl.removeTrack))
router.put('/order', requireAuth, asyncHandler(ctrl.reorderTracks))
router.post('/refresh', asyncHandler(ctrl.refreshStaleTracks))

export default router
