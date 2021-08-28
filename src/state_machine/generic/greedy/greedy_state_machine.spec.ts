import { Status, Ok } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { assertPending } from "../../util/assert";
import { GreedyStateMachine } from "./greedy_state_machine";

describe(`Greedy state machine`, () => {
    it('should return the final match of two potential matches', () => {
        let state = new GreedyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abc").asStateMachine(),
        ).asStateMachine();
        state = assertPending(state).next('a');
        state = assertPending(state).next('b');
        state = assertPending(state).next('c');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual('abc');
        expect(state.unconsumedInputs).toEqual([]);
    });

    it('should throw away early child errors', () => {
        let state = new GreedyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("zxy").asStateMachine(),
        ).asStateMachine();
        state = assertPending(state).next('z');
        state = assertPending(state).next('x');
        state = assertPending(state).next('y');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual('zxy');
        expect(state.unconsumedInputs).toEqual([]);
    });

    it('should throw away late child errors', () => {
        let state = new GreedyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abz").asStateMachine(),
        ).asStateMachine();
        state = assertPending(state).next('a');
        state = assertPending(state).next('b');
        state = assertPending(state).next('c');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual('ab');
        expect(state.unconsumedInputs).toEqual(['c']);
    });

    it('should error if all children error', () => {
        let state = new GreedyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abc").asStateMachine(),
        ).asStateMachine();
        state = assertPending(state).next('z');
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(['z']);
    });
})