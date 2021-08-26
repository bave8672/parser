import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { PendingStateMachine, StateMachine } from "../state_machine";

export class OptionalStateMachine<I, V> extends AbstractStateMachine<I, V[], any> {
    constructor(private child: StateMachine<I, V, any>) {
        super();
    }

    protected next(input: I) {
        this.unconsumedInputs.push(input);
        this.child = (this.child as PendingStateMachine<I, V, any>).next(input);
        if (this.child.status === Status.Error) {
            this.complete([]);
        } else if (this.child.status === Status.Ok) {
            this.unconsumedInputs.splice(0);
            this.complete([this.child.value]);
        }
        return this;
    }
}
