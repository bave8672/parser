import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { PendingStateMachine, StateMachine } from "../state_machine";

export class NotStateMachine<T> extends AbstractStateMachine<T, T[], string> {
    constructor(private readonly child: StateMachine<T, unknown, unknown>) {
        super();
    }

    protected next(input: T) {
        this.unconsumedInputs.push(input);
        (this.child as PendingStateMachine<T, unknown, unknown>).next(input);
        if (this.child.status === Status.Ok) {
            this.fail(`Matched value: ${this.child.value}`);
        } else if (this.child.status === Status.Error) {
            this.complete(this.unconsumedInputs.splice(0));
        }
        return this;
    }
}
