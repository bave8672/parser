import { Status } from "../../../result/result";
import { RegexStateMachine } from "./regex_state_machine";

describe(`Regex state machine`, () => {
    it(`Matches a simple regex`, () => {
        const stateMachine = new RegexStateMachine("abc").asStateMachine();
        while (stateMachine.status === Status.Pending) {
            stateMachine.play('a', 'b', 'c', 'd');
        }
        expect(stateMachine.status).toEqual(Status.Ok);
        if (stateMachine.status === Status.Ok) {
            expect(stateMachine.value).toEqual('abc');
            expect(stateMachine.unconsumedInputs).toEqual(['d']);
        }
    });

    it(`implements the Kleene star`, () => {
        let stateMachine = new RegexStateMachine("ab*a").asStateMachine();
        console.log(stateMachine);
        while (stateMachine.status === Status.Pending) {
            stateMachine.play('a', 'a', 'c');
        }
        console.log(stateMachine);
        expect(stateMachine.status).toEqual(Status.Ok);
        if (stateMachine.status === Status.Ok) {
            expect(stateMachine.value).toEqual('a');
            expect(stateMachine.unconsumedInputs).toEqual(['c']);
        }
    });
});
