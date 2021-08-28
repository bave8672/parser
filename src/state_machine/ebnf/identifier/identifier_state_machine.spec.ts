import { StateMachine } from "../../generic/state_machine";
import { Syntax } from "../../syntax/syntax";
import { assertError, assertOk, assertPending } from "../../util/assert";
import { IdentifierStateMachine } from "./identifier_state_machine";

describe(`Identifier state machine`, () => {
    let sm: StateMachine<string, Syntax, string>;

    beforeEach(() => {
        sm = new IdentifierStateMachine().asStateMachine();
    });

    it(`Should match a single letter`, () => {
        let sm = new IdentifierStateMachine().asStateMachine();
        assertPending(sm).next('a');
        assertPending(sm).next(' ');
        expect(assertOk(sm).value.getStringValue()).toEqual('a');
        expect(sm.unconsumedInputs).toEqual([' ']);
    });

    it(`Should not match a starting digit`, () => {
        let sm = new IdentifierStateMachine().asStateMachine();
        assertPending(sm).next('1');
        assertError(sm);
        expect(sm.unconsumedInputs).toEqual(['1']);
    });
    
    it(`Should match a word containing digits`, () => {
        let sm = new IdentifierStateMachine().asStateMachine();
        assertPending(sm).play('a', 'b', 'c', '1', '2', '3', ' ');
        console.log(JSON.stringify(sm, undefined, '   '));
        expect(assertOk(sm).value.getStringValue()).toEqual('abc123');
        expect(sm.unconsumedInputs).toEqual([' ']);
    });
})
