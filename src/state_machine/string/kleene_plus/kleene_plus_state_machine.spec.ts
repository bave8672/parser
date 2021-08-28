import { Ok, Status } from "../../../result/result";
import { assertPending } from "../../util/assert";
import { ExactMatchStateMachine } from "../exact_match/exact_match_state_machine";
import { KleenePlusStateMachine } from "./kleene_plus_state_machine";

describe(`Kleene plus state machine`, () => {
    it(`Matches multiple consecutive chars`, () => {
        let state = new KleenePlusStateMachine(() =>
            new ExactMatchStateMachine("a").asStateMachine()
        ).asStateMachine();
        state = assertPending(state).play(
            "a",
            "a",
            "a",
            "b"
        );
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual("aaa");
        expect(state.unconsumedInputs).toEqual(["b"]);
    });

    it(`Error when no match is found`, () => {
        let state = new KleenePlusStateMachine(() =>
            new ExactMatchStateMachine("a").asStateMachine()
        ).asStateMachine();
        state = assertPending(state).play(
            "b"
        );
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(["b"]);
    });
});
