import { Status } from "../../../result/result";
import { PendingStateMachine } from "../state_machine";
import { EmptyStateMachine } from "./empty_state_machine";

describe(`Empty state machine`, () => {
    it(`Should be constructed with the OK status`, () => {
        const esm = new EmptyStateMachine<string, void, unknown>(undefined).asStateMachine();
        expect(esm.status).toEqual(Status.Ok);
    });

    it(`Should store unused inputs`, () => {
        const esm = new EmptyStateMachine<string, void, unknown>(undefined).asStateMachine();
        (esm as PendingStateMachine<string, void, unknown>).next('a');
        expect(esm.status).toEqual(Status.Ok);
        expect(esm.unconsumedInputs).toEqual(['a']);
    });
});
