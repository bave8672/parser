import { Status } from "../../../result/result";
import { assertPending } from "../../util/assert";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { StateMachine } from "../state_machine";

/**
 * Generic class for matching multiple state machines against an input simultaneously
 * until the first match is found
 */
export class LazyStateMachine<I, V, E> extends AbstractStateMachine<I, V, E> {
    private readonly children: Set<StateMachine<I, V, E>>;

    public constructor(
        ...children: Array<StateMachine<I, V, E>>
    ) {
        super();
        this.children = new Set(children);
    }

    public next(input: I) {
        for (let child of this.children) {
            child = assertPending(child).next(input);
            if (child.status === Status.Error) {
                this.children.delete(child);
                if (this.children.size === 0) {
                    this.copy(child);
                }
            } else if (child.status === Status.Ok) {
                this.copy(child);
            }
        }
        return this;
    }
}
