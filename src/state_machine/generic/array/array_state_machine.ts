import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { PendingStateMachine, StateMachine } from "../state_machine";

/**
 * Vector equivalent of a state machine
 * Takes a sequence of state machines of the same type
 * and returns a new state machine that matches their output sequentially
 */
export class ArrayStateMachine<I, V, E> extends AbstractStateMachine<I, V[], E> {
    private readonly children: Array<StateMachine<I, V, E>>;
    private readonly values: V[] = [];

    public constructor(...children: Array<StateMachine<I, V, E>>) {
        super();
        this.children = children;
    }

    private cleanup() {
        this.children.splice(0);
        this.values.splice(0); 
    }

    protected next(input: I) {
        this.unconsumedInputs.push(input);
        let child = (this.children[0] as PendingStateMachine<I, V, E>).next(input);
        if (child.status === Status.Error) {
            this.fail(child.error);
            this.cleanup();
        } else if (child.status === Status.Ok) {
            this.values.push(child.value);
            if (this.children.length === 1) {
                this.unconsumedInputs.splice(0, this.unconsumedInputs.length, ...child.unconsumedInputs);
                this.complete(this.values.splice(0));
                this.cleanup();
            } else {
                this.children.shift();
                this.play(...child.unconsumedInputs);
            }
        }
        return this;
    }
}
