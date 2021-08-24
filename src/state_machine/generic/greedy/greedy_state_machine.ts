import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { PendingStateMachine, StateMachine } from "../state_machine";

/**
 * Generic class for matching multiple state machines against an input simultaneously
 * and returning the match that consumes the most input
 */
export class GreedyStateMachine<I, V, E> extends AbstractStateMachine<I, V, E> {
    private readonly children: Set<StateMachine<I, V, E>>;
    private latestChildValue?: V;

    public constructor(
        ...children: Array<StateMachine<I, V, E>>
    ) {
        super();
        this.children = new Set(children);
    }

    public next(input: I) {
        this.unconsumedInputs.push(input);
        for (let child of this.children) {
            child = (child as PendingStateMachine<I, V, E>).next(input);
            if (child.status === Status.Error) {
                this.children.delete(child);
                if (this.children.size === 0) {
                    if (this.latestChildValue) {
                        this.complete(this.latestChildValue);
                    } else {
                        this.copy(child);
                    }
                }
            } else if (child.status === Status.Ok) {
                this.latestChildValue = child.value;
                this.unconsumedInputs.splice(0);
                this.children.delete(child);
                if (this.children.size === 0) {
                    this.copy(child);
                }
            }
        }
        return this;
    }
}
