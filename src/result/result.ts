export enum Status {
    Pending = "Pending",
    Error = "Error",
    Ok = "Ok",
}

export class Pending {
    get status() {
        return Status.Pending as const;
    }
}

export class Err<E> {
    get status() {
        return Status.Error as const;
    }

    constructor(public readonly error: E) {}
}

export class Ok<T> {
    get status() {
        return Status.Ok as const;
    }

    constructor(public readonly value: T) {}
}

export type Result<T, E> = Pending | Err<E> | Ok<T>;
