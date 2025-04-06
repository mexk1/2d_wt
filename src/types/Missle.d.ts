import type AccelerableObject from "./AccelerableObject"
import type SelfDestroyableObject from "./SelfDestroyableObject"
import type MovingObject from "./MovingObject"
import type RenderableObject from "./RenderableObject"
import type RotatableObject from "./RotatingObject"

type Missile = RotatableObject & MovingObject & AccelerableObject & RenderableObject & SelfDestroyableObject & {
    drag: number,
    target?: MovingObject,
    trackTarget: () => void
}

export default Missile