import { Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { assertOk, assertPending } from "../../util/assert";
import { MapStateMachine } from "./map_state_machine";

describe(`Map state machine`, () => {
    it(`Maps the result of a child to a new value`, () => {
        type Token = {
            type: 'identifier';
            value: string;
        };
        let state = new MapStateMachine({
            child: new ExactMatchStateMachine("foo").asStateMachine(),
            map: (value): Token => ({ type: "identifier", value }),
        }).asStateMachine();
        state = assertPending(state).next('f');
        state = assertPending(state).next('o');
        state = assertPending(state).next('o');
        expect(state.status).toEqual(Status.Ok);
        expect(assertOk(state).value).toEqual({ type: 'identifier', value: 'foo' });
        expect(state.unconsumedInputs).toEqual([]);
    });
});
