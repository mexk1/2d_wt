const GRAVITY_ACC = 0.0
const GRAVITY_CONST = 500
const OBJECTS_GRAVITY = .01
const FRAME_RATE = 60
const DATA_UPDATE_RATE = 200
const CURSOR_GRAVITY = .5
const SHOW_GRAVITY_RADIUS = false
const containers = {}
const appData = {
    clientX: 0,
    clientY: 0,
}

let objects = []

containers.app = document.querySelector('#app');
const ctx = containers.app.getContext('2d');
const textWrapper = document.querySelector('#text');

containers.clientX = document.querySelector('#clientX span');
containers.clientY = document.querySelector('#clientY span');

document.querySelector('#reset')?.addEventListener('click', () => {
    const ctx = containers.app.getContext('2d');
    ctx.clearRect(0, 0, containers.app.width, containers.app.height);
    objects.forEach(el => {
        clearInterval(el.updateElAcc)
        clearInterval(el.updateElPos)
        clearInterval(el.calculateElGroundColision)
    })
    objects = []
    createFirstEl()
})

window.addEventListener('wheel', (e) => {
    const delta = Math.ceil(e.deltaY / 100) * -10
    console.log(delta)
    app.defaultMass = (app.defaultMass || 1) + delta

    if (app.defaultMass < 1) {
        app.defaultMass = 1
    }
})

const deleteEl = el => {
    clearInterval(el.updateElAcc)
    clearInterval(el.updateElPos)
    clearInterval(el.calculateElGroundColision)
    objects = objects.filter(obj => obj !== el)
}

const calculateElGroundColision = el => {
    const borderY = el.y + el.r;

    if ( borderY >= containers.app.height ) {
        el.ySpeed = 0
        return true
    }
    
    return false
}

const updateElYSpeed = (el, yAcc) => {
    if ( calculateElGroundColision(el) ) {
        // setTimeout(() => deleteEl(el), 1000)
        return 
    }

    el.ySpeed += yAcc;
}

const distanceBetweenTwoEls = (ax, ay, bx, by) => {
    const a = ax - bx;
    const b = ay - by;

    return Math.sqrt( a*a + b*b );
}


const calculateAccBetweenTwoEls = (ax, ay, am, bx, by, bm) => {
    const distance = distanceBetweenTwoEls(ax, ay, bx, by)

    const force = GRAVITY_CONST * ((am * bm) / Math.pow(distance, 2))

    const acc = force / am

    return {
        acc,
        force,
        distance,
    }
}

const updateElXSpeed = (el, xAcc) => {
    el.xSpeed += xAcc;
}

const updateElAcc = el => {
    if ( el.shouldBeFixed ) {
        return
    }

    objects.forEach(obj => {
        if ( obj === el ) return

        const angle = calculateAngleBetweenTwoEls(
            el.x,
            el.y,
            obj.x,
            obj.y
        )


        const distance = distanceBetweenTwoEls(el.x, el.y, obj.x, obj.y)

        if (distance < (el.r + obj.r + 10)) {
            return
        }
        
        if (distance > el.maxRelevantGravityRadius && distance > obj.maxRelevantGravityRadius) {
            return
        }

        const {acc} = calculateAccBetweenTwoEls(
            el.x,
            el.y,
            el.mass,
            obj.x,
            obj.y,
            obj.mass,
        )

        const {
            xAcc,
            yAcc,
            xMult,
            yMult,
        } = destructAcc(acc / 2, angle)

    
        updateElYSpeed(el, ((yAcc * yMult) + GRAVITY_ACC) / DATA_UPDATE_RATE)
        updateElXSpeed(el, (xAcc * xMult) / DATA_UPDATE_RATE)
    })
}

const updateElPos = el => {
    const maxY = containers.app.height - el.r;
    const maxX = containers.app.width - el.r;
    const minY = 0 + el.r;
    const minX = 0 + el.r;

    const newX = el.x + el.xSpeed;
    const newY = el.y + el.ySpeed;

    let invertX, invertY = false

    if ( newX > maxX ) {
        invertX = true
        el.x = maxX
    }

    if ( newX < minX ) {
        invertX = true
        el.x = minX
    }

    if ( newY > maxY ) {
        invertY = true
        el.y = maxY
    }

    if ( newY < minY ) {
        invertY = true
        el.y = minY
    }

    if ( invertX ) {
        el.xSpeed *= -1
        el.xSpeed = el.xSpeed / 2
    }

    if ( invertY ) {
        el.ySpeed *= -1
        el.ySpeed = el.ySpeed / 2
    }

    el.x += el.xSpeed;
    el.y += el.ySpeed;
}

const afterElCreate = el => {

    el.updateElAcc = setInterval(() => {
        updateElAcc(el)
    }, 1000 / DATA_UPDATE_RATE)

    el.updateElPos = setInterval(() => {
        updateElPos(el)
    }, 1000 / DATA_UPDATE_RATE)

    el.calculateElGroundColision = setInterval(() => {
        calculateElGroundColision(el)
    }, 1000 / DATA_UPDATE_RATE)

}

const calculateAngleBetweenTwoEls = (ax, ay, bx, by) => {
    const angle = Math.atan2(ay - by, ax - bx) * 180 / Math.PI;

    return angle
}

const destructAcc = (speed, angle) => {
    const absAngle = Math.abs(angle);

    const xMult = absAngle < 90 ? -1 : 1;
    const yMult = angle > 0 ? -1 : 1;

    const normAngle = absAngle > 90 ? 180 - absAngle : absAngle;

    const xAcc = Math.abs(Math.sin(normAngle) * speed);
    const yAcc = Math.abs(Math.cos(normAngle) * speed);

    return {
        xAcc,
        yAcc,
        xMult,
        yMult,
        angle,
        absAngle,
        normAngle,
    }
}

app.addEventListener('mousemove', (e) => {
    appData.clientX = e.clientX - app.offsetLeft;
    appData.clientY = e.clientY - app.offsetTop;
    
    containers.clientX.innerHTML = appData.clientX;
    containers.clientY.innerHTML = appData.clientY;
})

const render = async () => {
    ctx.clearRect(0, 0, containers.app.width, containers.app.height);
    maxMass = 0
    objects.forEach(el => {
        if ( el.mass > maxMass ) {
            maxMass = el.mass
        }
    })

    const promisses = objects.map((el) => {
        return new Promise((resolve, _) => {
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.maxRelevantGravityRadius, 0, 2 * Math.PI);
            // ctx.stroke()
           
            if (SHOW_GRAVITY_RADIUS) {
                const gradient = ctx.createRadialGradient(
                    el.x,
                    el.y,
                    el.r,
                    el.x,
                    el.y,
                    el.maxRelevantGravityRadius,
                );
        
                gradient.addColorStop(0, el.color ?? "green");
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fill();
            }
    
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.r, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 0, 0, ${el.mass / maxMass})`;
            ctx.fill();
            ctx.stroke();
            resolve()
            // ctx.fillText(`ys: ${el.ySpeed}`, el.x - 10, el.y + el.r + 15);
            // ctx.fillText(`xs: ${el.xSpeed}`, el.x - 10, el.y + el.r + 30);
            // ctx.fillText(`el ${index}`, el.x, el.y - 25);
            // ctx.fillText(`x: ${el.x}`, el.x - 10, el.y + el.r + 45);
            // ctx.fillText(`y: ${el.y}`, el.x - 10, el.y + el.r + 60);
        })
    })

    promisses.push(new Promise((resolve, _) => {
        ctx.beginPath();
        const maxRadius = calculateMaxRelevantGravityRadius({
            mass: app.defaultMass ?? 1,
        })

        ctx.arc(
            appData.clientX, 
            appData.clientY,
            maxRadius, 
            0, 
            2 * Math.PI
        );
        // ctx.stroke()
       
        const gradient = ctx.createRadialGradient(
            appData.clientX,
            appData.clientY,
            1,
            appData.clientX,
            appData.clientY,
            maxRadius,
        );

        gradient.addColorStop(0, "rgb(255,0,0)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fill();
        resolve()
    }))

    await Promise.all(promisses)
}

const calculateMaxRelevantGravityRadius = (el) => {
    let force = 0
    let r = 1
    let mass = .005
    let max = 10000

    do {
        data = calculateAccBetweenTwoEls(
            0,
            0,
            el.mass,
            0,
            r++,
            mass,
        )
        force = data.force
    } while( force > 0.0019 && r < max )

    return r
}

const createEl = (props) => {
    if (!props) {
        props = {}
    }

    const defaults = {
        x: appData.clientX,
        y: appData.clientY,
        r: 2,
        color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        mass: 10,
        ySpeed: 0,
        xSpeed: 0,
        shouldRender: true,
        maxRelevantGravityRadius: 0,
        updateElAcc: null,
        updateElPos: null,
        calculateElGroundColision: null,
    }

    const final = {
        ...defaults,
        ...props,
    }

    final.maxRelevantGravityRadius = calculateMaxRelevantGravityRadius(final)

    afterElCreate(final)
    objects.push(final)
    return final
}

containers.app.addEventListener('mouseup', () => {
    clearInterval(app.interval)
})

containers.app.addEventListener('mousedown', () => {
    app.interval = setInterval(() => {
        const el = {
            x: appData.clientX,
            y: appData.clientY,
            r: 2,
            mass: app?.defaultMass || 1,
            ySpeed: 0,
            xSpeed: 0,
            updateElAcc: null,
            updateElPos: null,
            calculateElGroundColision: null,
        }
        createEl(el)
    }, 50)
});

const createFirstEl = () => {
    const el = createEl({
        x: (containers.app.width / 2) - 5,
        y: (containers.app.height / 2) - 5,
        r: 10,
        // shouldBeFixed: true,
        mass: 400,
    })

    createOrbitalObjectForEl(el, el.r * 20)
}

const createOrbitalObjectForEl = (el, r) => {
    const o = createEl({
        x: el.x,
        y: el.y + r,
        r: 2,
        mass: 1,
        xSpeed: 0,
        ySpeed: 0,
    })

    speed = Math.sqrt((GRAVITY_CONST * el.mass) / (Math.pow(r, 2)))
    o.xSpeed = speed / 1.5
}

createFirstEl()
setInterval(render, 10)