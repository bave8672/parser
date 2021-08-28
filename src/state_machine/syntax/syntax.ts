export class Syntax<
    T = string,
    C extends Syntax<T, any[]>[] = Syntax<T, any[]>[]
> {
    static from(value: string | Syntax): Syntax {
        if (value instanceof Syntax) {
            return value;
        } else {
            return new Syntax('anonymous', value);
        }
    }

    constructor(
        readonly type: T,
        readonly value?: string,
        readonly children?: C
    ) {}

    getStringValue(): string {
        if (this.value !== undefined) {
            return this.value;
        } else if (this.children) {
            return this.children.map(c => c.getStringValue()).join('');
        } else {
            throw new Error(`SYntax should either contain a value or children`);
        }
    }
}
