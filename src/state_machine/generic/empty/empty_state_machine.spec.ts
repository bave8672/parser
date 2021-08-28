import { Status } from "../../../result/result";
import { assertPending } from "../../util/assert";
import { EmptyStateMachine } from "./empty_state_machine";

describe(`Empty state machine`, () => {
    it(`Should store unused inputs`, () => {
        const esm = new EmptyStateMachine<string, void, unknown>(undefined).asStateMachine();
        assertPending(esm).next('a');
        expect(esm.status).toEqual(Status.Ok);
        expect(esm.unconsumedInputs).toEqual(['a']);
    });
});
