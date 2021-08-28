import { Err, Ok, Status } from "../../result/result";
import { StateMachineLike } from "../dto/dto";
import { PendingStateMachine, StateMachine } from "../generic/state_machine";

export function assertPending<I, V, E>(
    stateMachine: StateMachineLike<I, V, E>
): PendingStateMachine<I, V, E> {
    const sm = stateMachine as StateMachine<I, V, E>;
    if (sm.status !== Status.Pending) {
        throw new Error(`Expected state machine to be Pending`);
    }
    return sm;
}

export function assertError<I, V, E>(stateMachine: StateMachineLike<I, V, E>): Err<E> {
    const sm = stateMachine as StateMachine<I, V, E>;
    if (sm.status !== Status.Error) {
        throw new Error(`Expected state machine to be Err`);
    }
    return sm;
}

export function assertOk<I, V, E>(stateMachine: StateMachineLike<I, V, E>): Ok<V> {
    const sm = stateMachine as StateMachine<I, V, E>;
    if (sm.status !== Status.Ok) {
        throw new Error(`Expected state machine to be OK`);
    }
    return sm;
}