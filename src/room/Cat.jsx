import { useCrate } from '../crate/CrateContext'
import catSheet from '../assets/sprites/JumpCattt.png'
import './Cat.css'

// 13-frame strip (32px each) — frame 0 is a plain sitting pose, used as
// the idle/still state; the full strip is a standing -> crouch -> leap ->
// land -> standing cycle, used for the jumping state.
export default function Cat() {
  const { isPreviewing } = useCrate()

  return (
    <div
      className={`cat${isPreviewing ? ' cat-jumping' : ''}`}
      style={{ backgroundImage: `url(${catSheet})` }}
    />
  )
}
