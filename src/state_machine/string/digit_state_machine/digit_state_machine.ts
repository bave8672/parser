import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

export class DigitStateMachine extends AbstractStateMachine<string, string, string> {
    protected next(input: string) {
        if (input >= '0' && input <= '9') {
            this.complete(input);
        } else {
            this.unconsumedInputs.push(input);
            this.fail(`char ${input} is not a digit`);
        }
        return this;
    }
}
