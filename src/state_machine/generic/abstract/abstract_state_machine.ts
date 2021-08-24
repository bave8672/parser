import { Result, Pending, Status, Ok, Err } from "../../../result/result";
import { StateMachine } from "../state_machine";


/**
 * Base class for all state machine implementations
 */
export abstract class AbstractStateMachine<I, V, E>  {
    private _state: Result<V, E> = new Pending();
    private _unconsumedInputs?: I[];

    protected get unconsumedInputs() {
        if (!this._unconsumedInputs) {
            this._unconsumedInputs = [];
        }
        return this._unconsumedInputs;
    }

    protected  get status(): Status {
        return this._state.status;
    }

    protected  get value(): V | undefined {
        return (this._state as Ok<V>).value;
    }

    protected get error(): E | undefined {
        return (this._state as Err<E>).error;
    }

    protected abstract next(input: I): AbstractStateMachine<I, V, E>;

    protected complete(value: V): void {
        this._state = new Ok(value);
    }

    protected fail(error: E): void {
        this._state = new Err(error);
    }

    protected copy(state: StateMachine<I, V, E> & (Err<E> | Ok<V>)): void {
        this._state = { 
            status: state.status, 
            error: (state as Err<E>).error, 
            value: (state as Ok<V>).value 
        };
        this._unconsumedInputs = state.unconsumedInputs;
    }

    /** Array equivalent of next() for convenience  */
    protected play(...inputs: I[]): AbstractStateMachine<I, V, E> {
        while (this.status === Status.Pending && inputs.length) {
            this.next(inputs.shift()!);
        }
        if (inputs.length) {
            this.unconsumedInputs.push(...inputs);
        }
        return this;
    }

    public asStateMachine(): StateMachine<I, V, E> {
        return this as StateMachine<I, V, E>;
    }
}
