import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";
import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { PendingStateMachine, StateMachine } from "../../generic/state_machine";

/** Helper class to concat the result of an array typed state machine into one string */
export class ConcatStateMachine<E> extends AbstractStateMachine<
    string,
    string,
    E
> {
    private readonly child: StateMachine<string, string[], E>;

    constructor(...children: StateMachine<string, string, E>[]) {
        super();
        this.child = new ArrayStateMachine(...children).asStateMachine();
    }

    protected next(input: string) {
        (this.child as PendingStateMachine<string, string, E>).next(input);
        if (this.child.status === Status.Error) {
            this.copy(this.child);
        } else if (this.child.status === Status.Ok) {
            this.unconsumedInputs.push(...this.child.unconsumedInputs);
            this.complete(this.child.value.join(""));
        }
        return this;
    }
}
