import type RotatableObject from "./types/RotatingObject"

const updateObjectRotation = (object: RotatableObject, angle: number) => {
    const newValue = object.rotation + angle

    if(newValue > 360) {
        object.rotation = newValue - 360
        return
    }

    if (newValue < 0) {
        object.rotation = 360 - angle
        return
    }

    object.rotation = newValue
}

export default updateObjectRotation