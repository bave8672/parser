import { Status } from "../../../result/result";
import { RegexStateMachine } from "./regex_state_machine";

// todo: implement a proper regex state machine
xdescribe(`Regex state machine`, () => {
    it(`Matches a regex`, () => {
        const stateMachine = new RegexStateMachine(/^abc$/).asStateMachine();
        while (stateMachine.status === Status.Pending) {
            stateMachine.play('a', 'b', 'c', 'd');
        }
        console.log(stateMachine);
        expect(stateMachine.status).toEqual(Status.Ok);
        if (stateMachine.status === Status.Ok) {
            expect(stateMachine.value).toEqual('abc');
            expect(stateMachine.unconsumedInputs).toEqual('d');
        }
    });
});
