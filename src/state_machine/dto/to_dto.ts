import { AbstractStateMachine } from "../generic/abstract/abstract_state_machine";
import { NotStateMachine } from "../generic/not/not_state_machine";
import { ExactMatchStateMachine } from "../string/exact_match/exact_match_state_machine";
import { StateMachineId } from "./id";
import { DtoType, StateMachineDto, ValueDto, Dto, DtoArgs, StateMachineConstructor, StateMachineConstructorArgs } from "./dto";

export function toDto<T>(
    arg: T,
    ...args: DtoArgs<StateMachineConstructorArgs<T>>
): Dto<T>{
    return (isStateMachineConstructor(arg) ? toStateMachineDto(arg, ...args) : toValueDto(arg)) as Dto<T>;
}

function toStateMachineDto<T extends StateMachineConstructor<any[]>>(
    StateMachine: T,
    ...args: DtoArgs<StateMachineConstructorArgs<T>>
): StateMachineDto {
    return {
        type: DtoType.StateMachine,
        id: StateMachineId.Array, // todo
        args,
    };
}

function toValueDto<T>(value: T): ValueDto<T> {
    return {
        type: DtoType.Value,
        value,
    };
}

type Constructor<T = any> = abstract new (...args: any[]) => T;

function isAssignableFrom(A: Constructor, B: Constructor): boolean {
    return A && A === B || isAssignableFrom(A.prototype, B);
}

function isStateMachineConstructor(Clazz: any): Clazz is StateMachineConstructor<any[]> {
    return isAssignableFrom(Clazz, AbstractStateMachine);
}

// todo
