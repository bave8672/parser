import { StateMachineId } from "./id";

export enum DtoType {
    StateMachine = 'StateMachine',
    Value = "Value",
}

export type ValueDto<T = unknown> = {
    type: DtoType.Value,
    value: T,
};

export type StateMachineDto = {
    type: DtoType.StateMachine,
    id: StateMachineId,
    args: Array<StateMachineDto | ValueDto>, 
}
