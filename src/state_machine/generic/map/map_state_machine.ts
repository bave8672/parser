import { Status } from "../../../result/result";
import { assertPending } from "../../util/assert";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { StateMachine } from "../state_machine";

type Opts<I, VIn, VOut, E> = {
    child: StateMachine<I, VIn, E>,
    map: (value: VIn) => VOut,
}

export class MapStateMachine<I, VIn, VOut, E> extends AbstractStateMachine<I, VOut, E> {
    private child: StateMachine<I, VIn, E>;
    private readonly map: (value: VIn) => VOut;

    constructor(opts: Opts<I, VIn, VOut, E>) {
        super();
        this.child = opts.child;
        this.map = opts.map;
    }

    protected next(input: I) {
        this.child = assertPending(this.child).next(input);
        if (this.child.status === Status.Error) {
            this.copy(this.child);
        } else if (this.child.status === Status.Ok) {
            this.complete(this.map(this.child.value));
            this.unconsumedInputs.push(...this.child.unconsumedInputs.splice(0));
        }
        return this;
    }
}