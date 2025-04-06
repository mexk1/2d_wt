import type Plane from "./types/Plane"

const renderPlanes = (context: CanvasRenderingContext2D, planes: Plane[]) => {
    planes.forEach( plane => {
        if (!plane.image) {
            return
        }
        
        const imageSize = plane.image_size ?? 30
        const ratio = plane.image.width / plane.image.height
        // rotate the plane image to match the plane rotation
        context?.save()

        // context.fillRect(plane.pos_x - 20, plane.pos_y -20, 40, 40);

        context?.translate(plane.pos_x, plane.pos_y)
        context?.rotate((plane.rotation - 180) * (Math.PI / 180))
        context?.drawImage(plane.image, -imageSize * ratio / 2, -imageSize / 2, imageSize * ratio, imageSize)
        context?.restore()
        Object.entries(plane).forEach(([key, value], index) => {
            context.fillText(
                `${key}: ${JSON.stringify(value)}`
                , plane.pos_x + 20
                , plane.pos_y + 10 * index
            )
        })
    })
}

export default renderPlanes