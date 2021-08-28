import { AbstractStateMachine } from "../generic/abstract/abstract_state_machine";
import { StateMachine } from "../generic/state_machine";
import { StateMachineId } from "./id";

export enum DtoType {
    StateMachine = 'StateMachine',
    Value = "Value",
}

export type StateMachineDto = {
    type: DtoType.StateMachine,
    id: StateMachineId,
    args: Array<StateMachineDto | ValueDto>, 
}

export type ValueDto<T = unknown> = {
    type: DtoType.Value,
    value: T,
};

export type StateMachineConstructor<A extends any[] = any[]> = abstract new (
    ...args: A
) => AbstractStateMachine<any, any, any>;

export type StateMachineConstructorArgs<T> =
    T extends StateMachineConstructor<infer A> ? A : never;


export type DtoArgs<T extends any[]> = 
    T extends [] ? []
    : T extends [infer A] ? [Dto<A>]
    : T extends [infer A, infer B] ? [Dto<A>, Dto<B>]
    : T extends [infer A, infer B, infer C] ? [Dto<A>, Dto<B>, Dto<C>]
    : T extends [infer A, infer B, infer C, infer D] ? [Dto<A>, Dto<B>, Dto<C>, Dto<D>]
    : T extends Array<infer R> ? Array<Dto<R>>
    : never;

export type StateMachineLike<I = any, V = any, E = any> = StateMachine<I, V, E> | AbstractStateMachine<I, V, E>;

export type Dto<T> = T extends StateMachineConstructor ? StateMachineDto : ValueDto<T>;
