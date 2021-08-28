import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";
import { assertValidRegex } from "./assert_valid_regex";
import { RegexStateMachineArrayBuilder } from "./regex_state_machine_array_builder";

/** Matches a pattern */
export class RegexStateMachine extends ConcatStateMachine<string> {
    constructor(pattern: string) {
        assertValidRegex(pattern);
        super(
            new ArrayStateMachine(
                ...new RegexStateMachineArrayBuilder(pattern).build()
            ).asStateMachine()
        );
    }
}
