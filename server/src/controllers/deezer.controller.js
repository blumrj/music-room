import deezerService from '../services/deezer.service.js'

async function search(req, res) {
  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'q is required' })
  const results = await deezerService.searchTracks(q)
  res.json(results)
}

export default { search }
