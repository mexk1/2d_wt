const calculateAngleBetweenTwoEls = (
    ax: number,
    ay: number,
    bx: number,
    by: number
) => {
    return Math.atan2(ay - by, ax - bx) * 180 / Math.PI;
}

export default calculateAngleBetweenTwoEls