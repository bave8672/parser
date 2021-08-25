import { Ok, Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { PendingStateMachine } from "../state_machine";
import { OneOrMoreStateMachine } from "./one_or_more_state_machine";

describe(`One or more state machine`, () => {
    it(`matches a single occurrences of a pattern`, () => {
        let state = new OneOrMoreStateMachine(() => new ExactMatchStateMachine('aa').asStateMachine()).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(...'aaab');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(['aa']);
        expect(state.unconsumedInputs).toEqual(['a', 'b']);
    });

    it(`matches consecutive occurrences of a string`, () => {
        let state = new OneOrMoreStateMachine(() => new ExactMatchStateMachine('a').asStateMachine()).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(...'aaab');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(['a', 'a', 'a']);
        expect(state.unconsumedInputs).toEqual(['b']);
    });

    it(`errors when there are no matches`, () => {
        let state = new OneOrMoreStateMachine(() => new ExactMatchStateMachine('a').asStateMachine()).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).next('b');
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(['b']);
    });
});
