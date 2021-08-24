import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { PendingStateMachine, StateMachine } from "../state_machine";

export class ZeroOrMoreStateMachine<I, V, E> extends AbstractStateMachine<I, V[], E> {
    private readonly values: V[] = [];
    private child: StateMachine<I, V, E>;

    constructor(private readonly createChild: () => StateMachine<I, V, E>) {
        super();
        this.child = createChild();
    }

    protected next(input: I) {
        this.unconsumedInputs.push(input);
        this.child = (this.child as PendingStateMachine<I, V, E>).next(input);
        if (this.child.status === Status.Error) {
            this.complete(this.values);
        } else if (this.child.status === Status.Ok) {
            this.values.push(this.child.value);
            this.child = this.createChild();
            this.unconsumedInputs.splice(0);
        }
        return this;
    }
}