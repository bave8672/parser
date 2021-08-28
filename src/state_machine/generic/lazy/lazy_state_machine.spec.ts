import { Ok, Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { assertPending } from "../../util/assert";
import { PendingStateMachine } from "../state_machine";
import { LazyStateMachine } from "./lazy_state_machine";

describe(`Greedy state machine`, () => {
    it('should race two machines and return the first match', () => {
        let state = new LazyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abc").asStateMachine(),
        ).asStateMachine();
        state = assertPending(state).next('a');
        state = assertPending(state).next('b');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual('ab');
        expect(state.unconsumedInputs).toEqual([]);
    });

    it('should throw away child errors', () => {
        let state = new LazyStateMachine(
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

    it('should error if all children error', () => {
        let state = new LazyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abc").asStateMachine(),
        ).asStateMachine();
        state = assertPending(state).next('z');
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(['z']);
    });
})