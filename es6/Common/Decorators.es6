export function Info () {
    console.log(this, arguments)
}

export function Enumerable (target, method, descriptor) {
    descriptor.enumerable = true
    return descriptor
}