import { AbstractStateMachine } from "../abstract/abstract_state_machine";

export class WildcardStateMachine<T> extends AbstractStateMachine<T, T, any> {
    protected next(input: T) {
        this.complete(input);
        return this;
    }
}
