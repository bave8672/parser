import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

/** Matches an exact string */
export class ExactMatchStateMachine extends AbstractStateMachine<
    string,
    string,
    string
> {
    private index = 0;

    constructor(private readonly pattern: string) {
        super();
    }

    protected next(input: string) {
        this.unconsumedInputs.push(input);
        if (input === this.pattern[this.index]) {
            this.index++;
        } else {
            this.fail(`input ${input} does not match ${this.pattern}`);
        }
        if (this.index === this.pattern.length) {
            this.unconsumedInputs.splice(0);
            this.complete(this.pattern);
        }
        return this;
    }
}
