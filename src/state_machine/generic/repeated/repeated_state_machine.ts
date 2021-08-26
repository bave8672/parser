import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { PendingStateMachine, StateMachine } from "../state_machine";

type Opts<I, V, E> = {
    min: number;
    max: number;
    createChild: () => StateMachine<I, V, E>;
    mapError: E extends string ? (((err: string, childError: E) => E) | undefined) : (err: string, childError: E) => E;
};

export class RepeatedStateMachine<I, V, E> extends AbstractStateMachine<
    I,
    V[],
    E
> {
    private readonly values: V[] = [];
    private child: StateMachine<I, V, E>;
    private consumedCount = 0;;
    private get valid(): boolean {
        return (
            this.values.length >= this.opts.min &&
            this.values.length <= this.opts.max
        );
    }

    constructor(private readonly opts: Opts<I, V, E>) {
        super();
        this.child = opts.createChild();
    }

    protected complete(value: V[]) {
        this.unconsumedInputs.splice(0, this.consumedCount);
        super.complete(this.values);
    }

    protected next(input: I) {
        this.unconsumedInputs.push(input);
        this.child = (this.child as PendingStateMachine<I, V, E>).next(input);
        if (this.child.status === Status.Error) {
            if (this.valid) {
                this.complete(this.values);
            } else {
                const errMsg = `Failed to match ${this.opts.min}-${this.opts.max}, received ${this.values.length}. Child error: ${this.child.error}`;
                this.fail(
                    this.opts.mapError ? this.opts.mapError(
                        errMsg,
                        this.child.error
                    ) : errMsg as any,
                );
            }
        } else if (this.child.status === Status.Ok) {
            this.values.push(this.child.value);
            this.consumedCount = this.unconsumedInputs.length;
            if (this.values.length === this.opts.max) {
                this.complete(this.values);
            } else {
                this.child = this.opts.createChild();
            }
        }
        return this;
    }
}
