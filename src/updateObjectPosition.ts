import type MovingObject from "./types/MovingObject"

const updateObjectPosition = (object: MovingObject) => {
    object.pos_x += object.speed_x
    object.pos_y += object.speed_y
}

export default updateObjectPosition