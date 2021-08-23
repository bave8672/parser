import { AbstractStateMachine } from "./abstract_state_machine";
import { StateMachine } from "./state_machine";

/**
 * Vector equivalent of a state machine
 * Takes a sequence of state machines and returns a new state machine that matches their output sequentially
 */
export class StateMachineArray<I, V, E> extends AbstractStateMachine<I, V[], E> {
    private readonly children: Array<StateMachine<I, V, E>>;
    private readonly values: V[] = [];

    public constructor(...children: Array<StateMachine<I, V, E>>) {
        super();
        this.children = children;
    }

    next(input: I) {
        const child = this.children[0];
        // todo
        // if (child.status)
        return this;
    }
}