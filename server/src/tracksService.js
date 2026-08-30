const prisma = require('./db')
const deezer = require('./deezer')
const { notifyTrackAdded } = require('./newsletter')

const SOURCE = 'deezer'

// Working guess from planning — revisit once we know how long a Deezer
// preview URL actually stays valid in practice.
const TTL_MS = 24 * 60 * 60 * 1000

async function addTrackFromDeezer({ deezerId, note = '' }) {
  const info = await deezer.getTrack(deezerId)

  const existing = await prisma.track.findUnique({
    where: { source_externalId: { source: SOURCE, externalId: info.externalId } },
  })

  if (existing) {
    return prisma.track.update({
      where: { id: existing.id },
      data: { ...info, lastFetchedAt: new Date() },
    })
  }

  const last = await prisma.track.findFirst({ orderBy: { position: 'desc' } })
  const position = (last?.position ?? -1) + 1

  const track = await prisma.track.create({
    data: { source: SOURCE, note, position, lastFetchedAt: new Date(), ...info },
  })

  // Only a genuine new addition notifies subscribers — refreshing an
  // already-in-the-crate track (the branch above) isn't "new music."
  notifyTrackAdded(track).catch((err) => console.error('notifyTrackAdded failed', err))

  return track
}

async function refreshTrack(track) {
  const info = await deezer.getTrack(track.externalId)
  return prisma.track.update({
    where: { id: track.id },
    data: { ...info, lastFetchedAt: new Date() },
  })
}

async function refreshStaleTracks() {
  const staleBefore = new Date(Date.now() - TTL_MS)
  const stale = await prisma.track.findMany({
    where: { lastFetchedAt: { lt: staleBefore } },
  })
  for (const track of stale) {
    await refreshTrack(track)
  }
  return stale.length
}

async function removeTrack(id) {
  await prisma.track.delete({ where: { id } })
}

// `orderedIds` is the full crate in its new order — rewritten as
// consecutive positions (0, 1, 2, ...) in a single transaction so a
// partial write can never leave the crate in an inconsistent order.
async function reorderTracks(orderedIds) {
  await prisma.$transaction(
    orderedIds.map((id, position) =>
      prisma.track.update({ where: { id }, data: { position } }),
    ),
  )
}

module.exports = {
  addTrackFromDeezer,
  refreshTrack,
  refreshStaleTracks,
  removeTrack,
  reorderTracks,
  TTL_MS,
}
