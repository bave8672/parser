import { Status } from "../../../result/result";
import { assertPending } from "../../util/assert";
import { ExactMatchStateMachine } from "./exact_match_state_machine";

describe(`Exact match state machine`, () => {
    it(`should match a string character by character`, () => {
        const matcher = new ExactMatchStateMachine("abc").asStateMachine();
        assertPending(matcher).play('a', 'b', 'c');
        expect(matcher.status).toEqual(Status.Ok);
        expect(matcher.unconsumedInputs).toEqual([]);
    });
});
