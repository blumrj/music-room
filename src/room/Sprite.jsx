import { UNIT } from './constants'

// Renders one item on the room grid. If `sheet` + `offset` + `size` are
// given, it shows that exact slice of the sheet (background-position
// trick). Otherwise it falls back to a flat placeholderColor box, so items
// can be placed on the grid before their real sprite coordinates are found
// — swapping one for the other later is a data change, not a component
// change. Position snaps to the 16px placement grid; the item's own pixel
// size doesn't have to — real art is rarely a clean multiple of the grid.
export default function Sprite({
  gridCol,
  gridRow,
  width,
  height,
  sheet,
  offset,
  placeholderColor,
  label,
  onClick,
}) {
  const style = {
    position: 'absolute',
    left: gridCol * UNIT,
    top: gridRow * UNIT,
    width,
    height,
    ...(sheet
      ? {
          backgroundImage: `url(${sheet})`,
          backgroundPosition: `-${offset.x}px -${offset.y}px`,
          imageRendering: 'pixelated',
        }
      : {
          background: placeholderColor,
          outline: '1px dashed rgba(0,0,0,0.25)',
        }),
  }

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className="room-sprite"
      style={style}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      aria-label={label}
      title={label}
    />
  )
}
