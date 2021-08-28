import { Pending, Err, Ok } from "../../result/result";

type BaseStateMachine<I, V, E> = {
    unconsumedInputs: I[],
    next(input: I): StateMachine<I, V, E>,
    play(...inputs: I[]): StateMachine<I, V, E>,
}

export type PendingStateMachine<I, V, E> = Pending & Pick<BaseStateMachine<I, V, E>, 'next' | 'play'>;

export type StateMachine<I, V, E> = Pick<BaseStateMachine<I, V, E>, 'unconsumedInputs'> & (
    | PendingStateMachine<I, V, E>
    | Err<E>
    | Ok<V>
);
