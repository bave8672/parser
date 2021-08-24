import { Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../char/exact_match/exact_match_state_machine";
import { RegexStateMachine } from "../../char/regex/regex_state_machine";
import { AbstractStateMachine } from "../abstract/abstract_state_machine";
import { ArrayStateMachine } from "./array_state_machine";

describe(`Array state machine`, () => {
    

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
