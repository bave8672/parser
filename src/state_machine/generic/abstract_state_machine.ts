import { Err, Ok, Pending, Result, Status } from "../../result/result";
import { StateMachine } from "./state_machine";

/**
 * Base class for all state machine implementations
 */
export abstract class AbstractStateMachine<I, V, E>  {
    private _state: Result<V, E> = new Pending();
    private _unconsumedInputs?: I[];

    get unconsumedInputs() {
        if (!this._unconsumedInputs) {
            this._unconsumedInputs = [];
        }
        return this._unconsumedInputs;
    }

    get status(): Status {
        return this._state.status;
    }

    get value(): V | undefined {
        return (this._state as Ok<V>).value;
    }

    get error(): E | undefined {
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

    public asStateMachine(): StateMachine<I, V, E> {
        return this as StateMachine<I, V, E>;
    }
}

