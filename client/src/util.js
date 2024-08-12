export function encrypt(str) {
    let b64 = Buffer.from(str).toString('base64')
    let encrypted = b64.split('').reverse().join('')
    let shifted = encrypted.split('').map((c) => String.fromCharCode(c.charCodeAt(0) + 1)).join('')
    return shifted
}
export function decrypt(str) {
    let shifted = str.split('').map((c) => String.fromCharCode(c.charCodeAt(0) - 1)).join('')
    let encrypted = shifted.split('').reverse().join('')
    let b64 = Buffer.from(encrypted, 'base64').toString('ascii')
    return b64
}
