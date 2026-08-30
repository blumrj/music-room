import Sprite from './Sprite'
import FloatingNotes from './FloatingNotes'
import Cat from './Cat'
import { ITEMS } from './items'
import { ROWS, FLOOR_ROW, NATIVE_WIDTH, NATIVE_HEIGHT, SCALE, UNIT } from './constants'
import floorTile from '../assets/sprites/floor-tile-wood.png'
import wallpaperTile from '../assets/sprites/wallpaper-tile.png'
import { useCrate } from '../crate/CrateContext'
import './Room.css'

const turntable = ITEMS.find((item) => item.isTurntable)
const turntableAnchor = {
  x: turntable.gridCol * UNIT + turntable.width / 2,
  y: turntable.gridRow * UNIT,
}

export default function Room() {
  const { open } = useCrate()

  return (
    <div className="room-viewport">
      <div
        className="room-frame"
        style={{ width: NATIVE_WIDTH * SCALE, height: NATIVE_HEIGHT * SCALE }}
      >
        <div
          className="room-stage"
          style={{
            width: NATIVE_WIDTH,
            height: NATIVE_HEIGHT,
            transform: `scale(${SCALE})`,
          }}
        >
          <div
            className="room-wall"
            style={{
              height: `${(FLOOR_ROW / ROWS) * 100}%`,
              backgroundImage: `url(${wallpaperTile})`,
              backgroundSize: '26px 64px',
              backgroundRepeat: 'repeat-x',
              imageRendering: 'pixelated',
            }}
          />
          <div
            className="room-floor"
            style={{
              height: `${((ROWS - FLOOR_ROW) / ROWS) * 100}%`,
              backgroundImage: `url(${floorTile})`,
              backgroundSize: '32px 32px',
              backgroundRepeat: 'repeat',
              imageRendering: 'pixelated',
            }}
          />

          {ITEMS.map((item) => (
            <Sprite
              key={item.id}
              {...item}
              onClick={item.isTurntable ? open : undefined}
            />
          ))}

          <FloatingNotes anchorX={turntableAnchor.x} anchorY={turntableAnchor.y} />
          <Cat />
        </div>
      </div>
    </div>
  )
}
