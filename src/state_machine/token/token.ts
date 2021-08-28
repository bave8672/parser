export class Token<T> {
    public constructor(readonly type: T, readonly value: string) {}
}
