import { Ok, Status } from "../../../result/result";
import { assertPending } from "../../util/assert";
import { ExactMatchStateMachine } from "../exact_match/exact_match_state_machine";
import { KleeneStarStateMachine } from "./kleene_star_state_machine";

describe(`Kleene star state machine`, () => {
    it(`Matches multiple consecutive chars`, () => {
        let state = new KleeneStarStateMachine(() =>
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
        let state = new KleeneStarStateMachine(() =>
            new ExactMatchStateMachine("a").asStateMachine()
        ).asStateMachine();
        state = assertPending(state).play(
            "b"
        );
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual("");
        expect(state.unconsumedInputs).toEqual(["b"]);
    });
});
