import tracksService from '../services/tracks.service.js'

async function listTracks(_req, res) {
  const tracks = await tracksService.listTracks()
  res.json(tracks)
}

async function addTrack(req, res) {
  const { deezerId, note } = req.body
  if (!deezerId) return res.status(400).json({ error: 'deezerId is required' })
  const track = await tracksService.addTrackFromDeezer({ deezerId, note })
  res.status(201).json(track)
}

async function removeTrack(req, res) {
  await tracksService.removeTrack(req.params.id)
  res.status(204).end()
}

async function reorderTracks(req, res) {
  const { orderedIds } = req.body
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return res.status(400).json({ error: 'orderedIds must be a non-empty array' })
  }
  await tracksService.reorderTracks(orderedIds)
  res.json({ ok: true })
}

async function refreshStaleTracks(_req, res) {
  const refreshed = await tracksService.refreshStaleTracks()
  res.json({ refreshed })
}

async function getPreviewUrl(req, res) {
  const previewUrl = await tracksService.getFreshPreviewUrl(req.params.id)
  if (previewUrl === null) return res.status(404).json({ error: 'Track not found' })
  res.json({ previewUrl })
}

export default {
  listTracks,
  addTrack,
  removeTrack,
  reorderTracks,
  refreshStaleTracks,
  getPreviewUrl,
}
