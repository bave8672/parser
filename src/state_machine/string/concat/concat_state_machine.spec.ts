import { Ok, Status } from "../../../result/result";
import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { PendingStateMachine } from "../../generic/state_machine";
import { ExactMatchStateMachine } from "../exact_match/exact_match_state_machine";
import { ConcatStateMachine } from "./concat_state_machine";

describe(`Concat state machine`, () => {
    it(`Concats multiple matchers into one result`, () => {
        let state = ConcatStateMachine.fromArray(
            new ExactMatchStateMachine("a").asStateMachine(),
            new ExactMatchStateMachine("bc").asStateMachine(),
            new ExactMatchStateMachine("123").asStateMachine()
        ).asStateMachine();
        state = (state as PendingStateMachine<string, string, string>).play(
            "a",
            "b",
            "c",
            "1",
            "2",
            "3"
        );
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual("abc123");
        expect(state.unconsumedInputs).toEqual([]);
    });

    it(`Surfaces errors from it's children`, () => {
        let state = ConcatStateMachine.fromArray(
            new ExactMatchStateMachine("a").asStateMachine(),
            new ExactMatchStateMachine("bc").asStateMachine(),
            new ExactMatchStateMachine("123").asStateMachine()
        ).asStateMachine();
        state = (state as PendingStateMachine<string, string, string>).play(
            "a",
            "b",
            "c",
            "x",
            "y",
            "z"
        );
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(["a", "b", "c", "x", "y", "z"]);
    });
});
