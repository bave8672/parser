export function illegalStateError(state: never, type?: string) {
    return new Error(`Illegal${type ? ` ${type} `: ' '}state: ${state}`);
}
