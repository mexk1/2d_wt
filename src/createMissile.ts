import calculateAngleBetweenTwoEls from "./calculateAngleBetweenTwoEls";
import type Missile from "./types/Missle";
import type MovingObject from "./types/MovingObject";
import type Plane from "./types/Plane";
import { v4 as uuidv4 } from 'uuid';
import updateObjectRotation from "./updateObjectRotation";

const createMissile = (missiles: {[key: string]: Missile},playerPlane: Plane, props: null|Partial<Missile>):Missile => {
    const uuid = uuidv4()
    const image = new Image();
    image.src = "./images/missile.png"
    const missile = {
        speed_x: playerPlane?.speed_x, 
        speed_y: playerPlane?.speed_y,
        max_speed: 1.5,
        drag: 0.5,
        max_acc: 3 ,
        throtle_percentage: 1,
        rotation: playerPlane?.rotation,
        // rotation: 360 - 135,
        image: image,
        pos_x: playerPlane.pos_x,
        pos_y: playerPlane.pos_y,
        image_size: 10,
        destroy_timeout: 1000 * 30,
        target: playerPlane.current_locked_target,
        uuid,
        destroy: () => {
            if (missiles[uuid] ?? null){
                delete missiles[uuid]
            }

            if (!playerPlane) {
                return
            }

            playerPlane.fired_missiles = playerPlane?.fired_missiles?.map( missile => {
                return missile.uuid !== uuid
            })
        },
        track: () => {
            const missile = missiles[uuid]
            const target = missile?.target

            if (!target) {
                return
            }

            const angle = calculateAngleBetweenTwoEls(
                0,
                0,
                missile.pos_x - target.pos_x,
                missile.pos_y - target.pos_y,
            )

            const diff = angle < 0 ? 360 + angle : angle
            const correction = diff - missile.rotation

            if (Math.abs(correction) > 2) {
                updateObjectRotation(
                    missile,
                    correction >= 0 ? 1 : -1
                )
            }
        },
        ...props,
    }

    missiles[uuid] = missile
    playerPlane.fired_missiles = playerPlane.fired_missiles ?? []
    playerPlane.fired_missiles.push(missiles[uuid])
    playerPlane.fire_ready = false

    setTimeout(() => {
        if (playerPlane) {
            playerPlane.fire_ready = true
        }
    }, playerPlane.fire_cooldown)

    missile.destroy_timeout = setTimeout(
        missile.destroy, 
        missile.destroy_timeout
    )

    setInterval(missile.track)
    
    return missile
}


export default createMissile