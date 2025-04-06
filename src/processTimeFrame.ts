import type AccelerableObject from "./types/AccelerableObject"
import type MovingObject from "./types/MovingObject"
import type RotatableObject from "./types/RotatingObject"
import updateObjectPosition from "./updateObjectPosition"
import updateObjectSpeed from "./updateObjectSpeed"

type Objects = {
    [key: string]: (MovingObject&AccelerableObject&RotatableObject)
}

const processTimeFrame = async ( objects: Objects ) => {
    await Promise.all([
        Promise.resolve(Object.values(objects).forEach(updateObjectPosition)),
        Promise.resolve(Object.values(objects).forEach(updateObjectSpeed))
    ])
}

export default processTimeFrame