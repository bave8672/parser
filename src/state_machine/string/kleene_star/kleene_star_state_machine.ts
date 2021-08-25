import { StateMachine } from "../../generic/state_machine";
import { ZeroOrMoreStateMachine } from "../../generic/zero_or_more/zero_or_more_state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";

export class KleeneStarStateMachine extends ConcatStateMachine<string> {
    constructor(createChild: () => StateMachine<string, string, string>) {
        super(new ZeroOrMoreStateMachine(createChild).asStateMachine());
    }
}
