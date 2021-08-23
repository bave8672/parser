import { Pending, Err, Ok } from "../../result/result";

export type StateMachine<I, V, E> = { unconsumedInputs: I[] } & (
    | (Pending & { next(input: I): StateMachine<I, V, E> })
    | Err<E>
    | Ok<V>
);