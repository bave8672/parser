import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

export class WhitespaceStateMachine extends AbstractStateMachine<string, string, string> {
    protected next(input: string) {
        switch (input) {
            case ' ':  // space
            case '\t': // tab
            case '\n': // newline
            case '\r': // carriage return
                this.complete(input);
                break;
            default:
                this.unconsumedInputs.push(input);
                this.fail(`char ${input} is not whitespace`);  
        }
        return this;
    }
}
