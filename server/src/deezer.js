const axios = require('axios')

const client = axios.create({ baseURL: 'https://api.deezer.com', timeout: 8000 })

function mapTrack(t) {
  return {
    externalId: String(t.id),
    title: t.title,
    artist: t.artist?.name ?? '',
    albumName: t.album?.title ?? '',
    coverUrl: t.album?.cover_medium ?? t.album?.cover ?? '',
    previewUrl: t.preview ?? '',
  }
}

async function searchTracks(query) {
  const { data } = await client.get('/search', { params: { q: query } })
  return (data.data ?? []).map(mapTrack)
}

async function getTrack(deezerId) {
  const { data } = await client.get(`/track/${deezerId}`)
  return mapTrack(data)
}

module.exports = { searchTracks, getTrack }
