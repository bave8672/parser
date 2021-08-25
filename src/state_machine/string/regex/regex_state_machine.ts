import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";
import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { StateMachine } from "../../generic/state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";
import { RegexStateMachineBuilder } from "./regex_state_machine_builder";

/** Matches a pattern */
export class RegexStateMachine extends ConcatStateMachine<string> {
    constructor(pattern: string) {
        super(
            new ArrayStateMachine(
                ...new RegexStateMachineBuilder(pattern).build()
            ).asStateMachine()
        );
    }
}
