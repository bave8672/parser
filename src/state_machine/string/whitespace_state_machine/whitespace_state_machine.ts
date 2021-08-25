import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

export class WhitespaceStateMachine extends AbstractStateMachine<string, string, string> {
    protected next(input: string) {
        switch (input.charCodeAt(0)) {
            case 9: // tab
            case 32: // space
                this.complete(input);
                break;
            default:
                this.unconsumedInputs.push(input);
                this.fail(`char ${input} is not whitespace`);  
        }
        return this;
    }
}
