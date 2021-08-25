import { Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { NotStateMachine } from "./not_state_machine";

describe(`Not state machine`, () => {
    it(`Matches a sequence that it's child errors on`, () => {
        let state = new NotStateMachine(new ExactMatchStateMachine('aa').asStateMachine()).asStateMachine();
        while (state.status === Status.Pending) {
            state.next('a');
            state.next('b');
        }
        expect(state.status).toEqual(Status.Ok);
        if (state.status === Status.Ok) {
            expect(state.value).toEqual(['a', 'b']);
            expect(state.unconsumedInputs).toEqual([]);
        }
    });

    it(`Errors if a child match is found`, () => {
        let state = new NotStateMachine(new ExactMatchStateMachine('aa').asStateMachine()).asStateMachine();
        while (state.status === Status.Pending) {
            state.next('a');
        }
        expect(state.status).toEqual(Status.Error);
        if (state.status === Status.Error) {
            expect(state.unconsumedInputs).toEqual(['a', 'a']);
        }
    });
});