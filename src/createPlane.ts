import type Plane from "./types/Plane";

const createPlane = (planes: Plane[], props: null|Partial<Plane>):Plane => {
    const image = new Image();
    image.src = "./images/f16.jpg"
    const plane = {
        speed_x: 0, // 100 -  x + y  
        speed_y: 0, // 100  - 10ms^2 30deg => y = y+=sin(30) * (throtle * max_speed)
        max_speed: 2,
        drag: 0.5,
        max_acc: 2,
        throtle_percentage: 0,
        rotation: 0,
        image: image,
        image_size: 50,
        pos_x: 0,
        pos_y: 0,
        fire_cooldown: 1000,
        fire_ready: true,
        min_speed: 0.1,
        ...props,
    }
    planes.push(plane)
    return plane
}


export default createPlane