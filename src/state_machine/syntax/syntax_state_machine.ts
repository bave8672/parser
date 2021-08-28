import { MapStateMachine } from "../generic/map/map_state_machine";
import { StateMachine } from "../generic/state_machine";
import { Syntax } from "./syntax";

export type ChildValue<T extends Syntax> = string | Syntax<T['type']> | Array<string | Syntax<T['type']>>;

export class SyntaxStateMachine<
    T extends Syntax = Syntax
> extends MapStateMachine<string, ChildValue<T>, T, string> {
    public constructor(
        private readonly type: T["type"],
        child: StateMachine<
            string,
            ChildValue<T>,
            string
        >
    ) {
        super({ child, map: value => this.mapValue(value) })
    }

    // super hacky but too useful not to use; 
    // todo: see if the types can be made neater
    private mapValue(value: ChildValue<T>): T {
        if (typeof value === 'string') {
            return new Syntax(this.type, value) as T;
        } else if (Array.isArray(value)) {
            return new Syntax(this.type, undefined, value.map(Syntax.from)) as T;
        } else {
            return new Syntax(this.type, undefined, [value]) as T;
        }
    }
}
