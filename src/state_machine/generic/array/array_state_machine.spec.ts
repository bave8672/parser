import { Status } from "../../../result/result";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { ArrayStateMachine } from "./array_state_machine";

describe(`Array state machine`, () => {
    /** Matches an exact string */
    class ExactMatchStateMachine extends AbstractStateMachine<string, string, string> {
        private i = 0;

        constructor(private readonly pattern: string) {
            super();
        }

        next(input: string) {
            this.unconsumedInputs.push(input);
            if (input === this.pattern[this.i]) {
                this.i++;
            } else {
                this.fail(`input ${input} does not match ${this.pattern}`);
            }
            if (this.i === this.pattern.length) {
                this.unconsumedInputs.splice(0);
                this.complete(this.pattern);
            }
            return this;
        }
    }

    /** Matches a pattern. Note: Will not terminate until encountering an unmatched char */
    class RegexStateMachine extends AbstractStateMachine<string, string, string> {
        private match = '';

        constructor(private readonly pattern: RegExp) {
            super();
        }

        next(input: string) {
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

    it(`Simple match example`, () => {
        let matcher = new ArrayStateMachine<string, string, string>(
            new ExactMatchStateMachine('a').asStateMachine(), 
            new ExactMatchStateMachine('b').asStateMachine()
        ).asStateMachine();
        if (matcher.status === Status.Pending) {
            matcher = matcher.play('a', 'b');
        }
        expect(matcher.status).toEqual(Status.Ok);
        if (matcher.status === Status.Ok) {
            expect(matcher.value).toEqual(['a', 'b']);
            expect(matcher.unconsumedInputs).toEqual([]);
        }
    });

    it(`Simple error example`, () => {
        let matcher = new ArrayStateMachine<string, string, string>(
            new ExactMatchStateMachine('a').asStateMachine(), 
            new ExactMatchStateMachine('b').asStateMachine()
        ).asStateMachine();
        if (matcher.status === Status.Pending) {
            matcher = matcher.play('a', 'a');
        }
        expect(matcher.status).toEqual(Status.Error);
        expect(matcher.unconsumedInputs).toEqual(['a', 'a']);
    });

    it(`Play example`, () => {
        let matcher = new ArrayStateMachine<string, string, string>(
            new ExactMatchStateMachine('aa').asStateMachine(), 
            new ExactMatchStateMachine('ab').asStateMachine()
        ).asStateMachine();
        if (matcher.status === Status.Pending) {
            matcher = matcher.play('a', 'a', 'a', 'b', 'b');
        }
        expect(matcher.status).toEqual(Status.Ok);
        if (matcher.status === Status.Ok) {
            expect(matcher.value).toEqual(['aa', 'ab']);
            expect(matcher.unconsumedInputs).toEqual(['b']);
        }
    });

    it(`Should pass unmatched inputs to the next machine in the sequence`, () => {
        let matcher = new ArrayStateMachine<string, string, string>(
            new RegexStateMachine(/^a$/).asStateMachine(), 
            new ExactMatchStateMachine('b').asStateMachine()
        ).asStateMachine();
        if (matcher.status === Status.Pending) {
            matcher = matcher.play('a', 'b');
        }
        expect(matcher.status).toEqual(Status.Ok);
        if (matcher.status === Status.Ok) {
            expect(matcher.value).toEqual(['a', 'b']);
            expect(matcher.unconsumedInputs).toEqual([]);
        }
    });
});
