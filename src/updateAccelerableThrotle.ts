import type AccelerableObject from "./types/AccelerableObject"

const updateAccelerableThrotle = (object: AccelerableObject, throtle: number) => {
    object.throtle_percentage += throtle

    if (object.throtle_percentage > 1) {
        object.throtle_percentage = 1
    }

    if (object.throtle_percentage < 0 ) {
        object.throtle_percentage = 0
    }
}

export default updateAccelerableThrotle