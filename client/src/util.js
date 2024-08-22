
// import { getPlaiceholder } from "plaiceholder";
import { cache } from "react";

export function encrypt(str) {
    let b64 = Buffer.from(str).toString('base64')
    let encrypted = b64.split('').reverse().join('')
    let shifted = encrypted.split('').map((c) => String.fromCharCode(c.charCodeAt(0) + 1)).join('')
    return shifted
}

export function wait(seconds) {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
export function decrypt(str) {
    let shifted = str.split('').map((c) => String.fromCharCode(c.charCodeAt(0) - 1)).join('')
    let encrypted = shifted.split('').reverse().join('')
    let b64 = Buffer.from(encrypted, 'base64').toString('ascii')
    return b64
}

export const getImage = cache(async (src) => {
    try {
        // const file = await fs.readFile("/blur_food.png");

        // const { base64 } = await getPlaiceholder(file);
        // 
        // return base64
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAHHRFWHRDcmVhdGlvbgAyMDI0OjA3OjI1IDEyOjAxOjE5Dzs59QAAAE9JREFUeJwBRAC7/wATEwwkUU9KnNLSzbb7+/NCAEJBPaZ/f3n/m5uV/728uLAANTMxzTw8OP9DQj//hoWAzAAuLidoBAIAw1xcWbulpaFuMJEevgmlsqEAAAAASUVORK5CYII="
    } catch (err) {
        err;
    }
})

export const getBlur = () => {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAHHRFWHRDcmVhdGlvbgAyMDI0OjA3OjI1IDEyOjAxOjE5Dzs59QAAAE9JREFUeJwBRAC7/wATEwwkUU9KnNLSzbb7+/NCAEJBPaZ/f3n/m5uV/728uLAANTMxzTw8OP9DQj//hoWAzAAuLidoBAIAw1xcWbulpaFuMJEevgmlsqEAAAAASUVORK5CYII=";
}


export const getImages = async (srcs) => {
    return await Promise.all(srcs.map(getImage));
}

