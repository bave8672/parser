import { Ok, Status } from "../../../result/result";
import { ExactMatchStateMachine } from "../../char/exact_match/exact_match_state_machine";
import { PendingStateMachine } from "../state_machine";
import { LazyStateMachine } from "./lazy_state_machine";

describe(`Greedy state machine`, () => {
    it('should race two machines and return the first match', () => {
        let state = new LazyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abc").asStateMachine(),
        ).asStateMachine();
        state = (state as PendingStateMachine<string, string, string>).next('a');
        state = (state as PendingStateMachine<string, string, string>).next('b');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual('ab');
        expect(state.unconsumedInputs).toEqual([]);
    });

    it('should throw away child errors', () => {
        let state = new LazyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("zxy").asStateMachine(),
        ).asStateMachine();
        state = (state as PendingStateMachine<string, string, string>).next('z');
        state = (state as PendingStateMachine<string, string, string>).next('x');
        state = (state as PendingStateMachine<string, string, string>).next('y');
        expect(state.status).toEqual(Status.Ok);
        expect((state as Ok<string>).value).toEqual('zxy');
        expect(state.unconsumedInputs).toEqual([]);
    });

    it('should error if all children error', () => {
        let state = new LazyStateMachine(
            new ExactMatchStateMachine("ab").asStateMachine(),
            new ExactMatchStateMachine("abc").asStateMachine(),
        ).asStateMachine();
        state = (state as PendingStateMachine<string, string, string>).next('z');
        expect(state.status).toEqual(Status.Error);
        expect(state.unconsumedInputs).toEqual(['z']);
    });
})