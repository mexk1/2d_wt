import type AccelerableObject from "./AccelerableObject"
import type Missile from "./Missle"
import type MovingObject from "./MovingObject"
import type RenderableObject from "./RenderableObject"
import type RotatableObject from "./RotatingObject"

type Plane = RotatableObject & MovingObject & AccelerableObject & RenderableObject & {
    drag: number,
    fired_missiles?: Missile[],
    fire_cooldown: number,
    fire_ready: boolean,
    current_locked_target?: MovingObject
}

export default Plane 