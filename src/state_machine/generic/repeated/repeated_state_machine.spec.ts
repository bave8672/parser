import { Ok, Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { PendingStateMachine } from "../state_machine";
import { RepeatedStateMachine } from "./repeated_state_machine";

describe(`Zero or more state machine`, () => {
    it(`matches zero occurrences of a string`, () => {
        let state = new RepeatedStateMachine({
            min: 0,
            max: 3,
            createChild: () => new ExactMatchStateMachine("a").asStateMachine(),
            mapError: undefined,
        }).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).next(
            "b"
        );
        expect(state.status).toEqual(Status.Ok);
        expect(state.unconsumedInputs).toEqual(["b"]);
    });

    it(`matches a single occurrences of a pattern`, () => {
        let state = new RepeatedStateMachine({
            min: 0,
            max: 3,
            createChild: () =>
                new ExactMatchStateMachine("aa").asStateMachine(),
            mapError: undefined,
        }).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(
            ..."aaab"
        );
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(["aa"]);
        expect(state.unconsumedInputs).toEqual(["a", "b"]);
    });

    it(`matches consecutive occurrences of a string`, () => {
        let state = new RepeatedStateMachine({
            min: 0,
            max: 3,
            createChild: () => new ExactMatchStateMachine("a").asStateMachine(),
            mapError: undefined,
        }).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(
            ..."aaab"
        );
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(["a", "a", "a"]);
        expect(state.unconsumedInputs).toEqual(["b"]);
    });

    it(`fails if the min is not reached`, () => {
        let state = new RepeatedStateMachine({
            min: 3,
            max: 3,
            createChild: () => new ExactMatchStateMachine("a").asStateMachine(),
            mapError: undefined,
        }).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(
            ..."aab"
        );
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(["a", "a", "b"]);
    });

    it(`completes if the  max is reached`, () => {
        let state = new RepeatedStateMachine({
            min: 0,
            max: 3,
            createChild: () => new ExactMatchStateMachine("a").asStateMachine(),
            mapError: undefined,
        }).asStateMachine();
        state = (state as PendingStateMachine<string, string[], string>).play(
            ..."aaaa"
        );
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string[]>).value).toEqual(["a", "a", "a"]);
        expect(state.unconsumedInputs).toEqual(["a"]);
    });
});
