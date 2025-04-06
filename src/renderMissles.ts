import type Missile from "./types/Missle"

const renderMissiles = (context: CanvasRenderingContext2D, missiles: {[key: string]: Missile}) => {
    Object.values(missiles).forEach( missile => {
        if (!missile.image) {
            return
        }
        
        const imageSize = missile.image_size ?? 10
        const ratio = missile.image.width / missile.image.height
        // rotate the missile image to match the missile rotation
        context?.save()
        context?.translate(missile.pos_x, missile.pos_y)
        context?.rotate(missile.rotation * Math.PI / 180)
        context?.drawImage(missile.image, -imageSize * ratio / 2, -imageSize / 2, imageSize * ratio, imageSize)
        context?.restore()
        Object.entries(missile).forEach(([key, value], index) => {
            context.fillText(
                `${key}: ${JSON.stringify(value)}`
                , missile.pos_x + 20
                , missile.pos_y + 10 * index
            )
        })
    })
}

export default renderMissiles