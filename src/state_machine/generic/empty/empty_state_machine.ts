import { AbstractStateMachine } from "../abstract/abstract_state_machine";

/** Matches an empty sequence */
export class EmptyStateMachine<I, V, E> extends AbstractStateMachine<I, V, E> {
    constructor(value: V) {
        super();
        this.complete(value);
    }

    protected next(input: I) {
        this.unconsumedInputs.push(input);
        return this;
    }
}
