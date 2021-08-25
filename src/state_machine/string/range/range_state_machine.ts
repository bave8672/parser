import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

/** Helper for matching character ranges e.g. [A-Za-z0-9] */
export class RangeStateMachine extends AbstractStateMachine<
    string,
    string,
    string
> {
    constructor(private readonly min: string, private readonly max: string) {
        super();
    }

    protected next(input: string) {
        if (input >= this.min && input <= this.max) {
            this.complete(input);
        } else {
            this.unconsumedInputs.push(input);
            this.fail(
                `${input} does not fall in range ${this.min}-${this.max}`
            );
        }
        return this;
    }
}
