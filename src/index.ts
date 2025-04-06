import createPlane from "./createPlane";
import processTimeFrame from "./processTimeFrame";
import renderPlanes from "./renderPlanes";
import type Containers from "./types/Containers";
import type Plane from "./types/Plane"
import updateObjectRotation from "./updateObjectRotation";
import updateObjectThrotle from "./updateAccelerableThrotle";
import type Missile from "./types/Missle";
import renderMissiles from "./renderMissles";
import createMissile from "./createMissile";

const TICK_RATE = 1
const UPDATE_RATE = 100
const containers:Containers = {}

containers.app = document.querySelector<HTMLCanvasElement>('#app');
const context = containers.app?.getContext('2d');

const planes:Plane[] = []
const missiles:{[key: string]: Missile} = {}

let playerPlane:Plane|null = null
let keyDownInterval: {[key: string]: NodeJS.Timeout} = {}

const handleThrotleKeys = (code: string) => {
    let throtle = 0

    if (code === 'ArrowUp') {
        throtle = 0.005
    }

    if (code === 'ArrowDown') {
        throtle = -0.005
    }
    
    playerPlane && updateObjectThrotle(
        playerPlane,
        throtle
    )
}


const handleFireKey = () => {
    const image = new Image();
    image.src = "./images/missile.png"

    if (!playerPlane || !playerPlane.fire_ready || !playerPlane.current_locked_target) {
        return
    }

    createMissile(missiles, playerPlane, null)
}

const handleRotationKeys = (code: string) => {
    let angle = 0

    if (code === 'ArrowLeft') {
        angle = -0.5
    }

    if (code === 'ArrowRight') {
        angle = +0.5
    }
    
    playerPlane && updateObjectRotation(
        playerPlane, 
        angle
    )
}

window.addEventListener('keydown', event => {
    if (keyDownInterval[event.code] ?? null) {
        return
    }

    keyDownInterval[event.code] = setInterval(() => {
        if (['ArrowLeft', 'ArrowRight'].includes(event.code)) {
            new Promise(() => {
                handleRotationKeys(event.code)
            })
        }
        
        if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
            new Promise(() => {
                handleThrotleKeys(event.code)
            })
        }

        if ( 'Space' === event.code) {
            new Promise(() => {
                handleFireKey()
            })
        }
    }, 1)
})

window.addEventListener('keyup', event => {
    if (keyDownInterval[event.code] ?? null) {
        clearInterval(keyDownInterval[event.code])
        delete keyDownInterval[event.code]
    }
})

const render = () => {
    const context = containers.app?.getContext('2d');
    context?.clearRect(0, 0, containers.app?.width ?? 0, containers.app?.height ?? 0);

    if (!context) {
        return
    }
    
    renderPlanes(context, planes)
    renderMissiles(context, missiles)
}

playerPlane = createPlane(planes, {
    pos_x: (containers.app?.width ?? 0) / 2,
    pos_y: (containers.app?.height ?? 0) / 2,
    drag: 0.1,
    max_speed: 5,
    // throtle_percentage: 1
    // speed_x: 1,
    // speed_y: 1,
})

const targetPlane = createPlane(planes, {
    pos_x: 40,
    // pos_x: (containers.app?.width ?? 0) - 40,
    // pos_y: 40,
    pos_y: (containers.app?.height ?? 0) - 40,
    rotation: 0,
    drag: 0.1,
    // max_speed: 1,
    speed_x: 1,
    // speed_x: 1,
    // speed_y: 1,
})

setInterval(() => {
    const maxX = containers.app?.width ?? 0
    if(targetPlane.pos_x > maxX) {
        targetPlane.pos_x = 0
    }
})

playerPlane.current_locked_target = targetPlane

setInterval(render)
setInterval(() => processTimeFrame({
    ...missiles,
    ...planes.reduce((planes, plane, index) => {
        planes[`plane_${index}`] = plane
        return planes
    }, {} as {[key: string]: Plane})
}), 1000 / UPDATE_RATE)