import { Ok, Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { PendingStateMachine } from "../state_machine";
import { ZeroOrMoreStateMachine } from "./zero_or_more_state_machine";

describe(`Zero or more state machine`, () => {
    it(`matches zero occurrences of a string`, () => {
        let state = new ZeroOrMoreStateMachine(() => new ExactMatchStateMachine('a').asStateMachine()).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).next('b');
        expect(state.status).toEqual(Status.Ok);
        expect(state.unconsumedInputs).toEqual(['b']);
    });


    it(`matches a single occurrences of a pattern`, () => {
        let state = new ZeroOrMoreStateMachine(() => new ExactMatchStateMachine('aa').asStateMachine()).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(...'aaab');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(['aa']);
        expect(state.unconsumedInputs).toEqual(['a', 'b']);
    });

    it(`matches consecutive occurrences of a string`, () => {
        let state = new ZeroOrMoreStateMachine(() => new ExactMatchStateMachine('a').asStateMachine()).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(...'aaab');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(['a', 'a', 'a']);
        expect(state.unconsumedInputs).toEqual(['b']);
    });
});
