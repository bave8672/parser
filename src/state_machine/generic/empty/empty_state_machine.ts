import { AbstractStateMachine } from "../abstract/abstract_state_machine";

/** Matches an empty sequence */
export class EmptyStateMachine<I, V, E> extends AbstractStateMachine<I, V, E> {
    constructor(private readonly _value: V) {
        super();
    }

    protected next(input: I) {
        this.complete(this._value);
        this.unconsumedInputs.push(input);
        return this;
    }
}
