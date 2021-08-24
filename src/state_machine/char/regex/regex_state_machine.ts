import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

/** Matches a pattern. Note: Will not terminate until encountering an unmatched char */
export class RegexStateMachine extends AbstractStateMachine<
    string,
    string,
    string
> {
    private match = "";

    constructor(private readonly pattern: RegExp) {
        super();
    }

    protected next(input: string) {
        if (this.pattern.test(this.match + input)) {
            this.match += input;
        } else if (this.match) {
            this.unconsumedInputs.push(input);
            this.complete(this.match);
        } else {
            this.unconsumedInputs.push(input);
            this.fail(`Input ${input} does not mach patter ${this.pattern}`);
        }
        return this;
    }
}
