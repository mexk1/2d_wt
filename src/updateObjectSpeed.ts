import type AccelerableObject from "./types/AccelerableObject";
import type MovingObject from "./types/MovingObject";
import type RotatableObject from "./types/RotatingObject";

const context = document.querySelector<HTMLCanvasElement>('#app')?.getContext('2d');


const updateObjectSpeed = (object: MovingObject & AccelerableObject & RotatableObject) => {
    const absAngle = Math.abs(object.rotation);

    const xMult = absAngle < 180 ? -1 : 1;
    const yMult = absAngle < 180 || absAngle > 90 ? -1 : 1;

    const throtleAcc = (object.max_acc * object.throtle_percentage)
    const objectAcc = throtleAcc

    const radians = absAngle * (Math.PI / 180);

    const normAngle = absAngle > 90 ? 180 - absAngle : absAngle;
    const xAcc = Math.cos(radians) * objectAcc// * xMult;
    const yAcc = Math.sin(radians) * objectAcc;

    const maxX = Math.abs(Math.cos(radians) * object.max_speed)
    const maxY = Math.abs(Math.sin(radians) * object.max_speed)

    if (Math.abs(object.speed_y + yAcc) > Math.abs(maxY)) {
        object.speed_y = maxY * (yAcc >= 0 ? 1 : - 1)
    } else {
        object.speed_y += yAcc
    }

    if (Math.abs(object.speed_x + xAcc) > Math.abs(maxX)) {
        object.speed_x = maxX * (xAcc >= 0 ? 1 : - 1)
    }else {
        object.speed_x += xAcc
    }
    
    // console.clear()
    // console.log('rotation', object.rotation)
    // console.log('absAngle', absAngle)
    // console.log('xAcc', xAcc)
    // console.log('yAcc', yAcc)
    // console.log('xMult', xMult)
    // console.log('yMult', yMult)
    // console.log('objectAcc', objectAcc)
    // console.log('normAngle', normAngle)
    // console.log('radians', radians)
    // console.log('maxX', maxX)
    // console.log('maxY', maxY)
    // console.log('object.speed_x', object.speed_x)
    // console.log('object.speed_y', object.speed_y)

    // Object.entries({
    //     absAngle, 
    //     realAngle: object.rotation,
    //     normAngle,
    //     sinX: Math.sin(radians),
    //     cosY: Math.cos(radians),
    //     sin2X: Math.sin(absAngle),
    //     cos2Y: Math.cos(absAngle),
    //     yMult,
    //     xMult,
    //     drag: object.drag,
    //     x: object.speed_x
    // }).forEach(([key, value], index) => {
    //     if (!context) {
    //         return
    //     }

    //     context.save()
    //     context.fillText(
    //         `${key}: ${JSON.stringify(value)}`
    //         , object.pos_x - 130, object.pos_y + 10 * index
    //     )
    //     context.restore()
    // })
}


export default updateObjectSpeed