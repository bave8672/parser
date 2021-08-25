import { OneOrMoreStateMachine } from "../../generic/one_or_more/one_or_more_state_machine";
import { StateMachine } from "../../generic/state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";

export class KleenePlusStateMachine extends ConcatStateMachine<string> {
    constructor(createChild: () => StateMachine<string, string, string>) {
        super(new OneOrMoreStateMachine(createChild).asStateMachine());
    }
}
