import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";
import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { StateMachine } from "../../generic/state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";

/** Matches a pattern */
export class RegexStateMachine extends ConcatStateMachine<string> {
    private static buildStateMachineArray(
        pattern: string,
        i = 0,
        j = pattern.length - 1
    ): StateMachine<string, string, string>[] {
        const stateMachines: StateMachine<string, string, string>[] = [];
        while (i < j) {

        }
        return stateMachines;
    }

    constructor(private readonly pattern: string) {
        super(...RegexStateMachine.buildStateMachineArray(pattern));
    }
}
