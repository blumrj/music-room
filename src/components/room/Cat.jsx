import { useCrate } from "../../context/CrateContext";
import catSheet from "../../assets/sprites/JumpCattt.png";
import "./Cat.css";
import { UNIT } from "./constants";

// 13-frame strip (32px each) — frame 0 is a plain sitting pose, used as
// the idle/still state; the full strip is a standing -> crouch -> leap ->
// land -> standing cycle, used for the jumping state.
export default function Cat({ gridCol, gridRow }) {
  const { isPreviewing } = useCrate();

  return (
    <div
      className={`cat${isPreviewing ? " cat-jumping" : ""}`}
      style={{
        left: gridCol * UNIT,
        top: gridRow * UNIT,
        backgroundImage: `url(${catSheet})`,
      }}
    />
  );
}
