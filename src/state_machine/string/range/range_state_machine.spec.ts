import { Status } from "../../../result/result";
import { RangeStateMachine } from "./range_state_machine";

describe(`Range state machine`, () => {
    testRange(() => new RangeStateMachine('A', 'Z'), 'A', 'Z', true);
    testRange(() => new RangeStateMachine('A', 'Z'), 'a', 'z', false);
    testRange(() => new RangeStateMachine('3', '5'), '0', '2', false);
    testRange(() => new RangeStateMachine('3', '5'), '3', '5', true);
    testRange(() => new RangeStateMachine('3', '5'), '7', '9', false);

    function getRange(start: string, end: string): string[] {
        const range: string[] = [];
        for (
            let char = start;
            char <= end;
            char = String.fromCharCode(char.charCodeAt(0) + 1)
        ) {
            range.push(char);
        }
        return range;
    }

    function testRange(
        getStateMachine: () => RangeStateMachine,
        start: string,
        end: string,
        ok: boolean
    ) {
        getRange(start, end).forEach((char) =>
            it(`Should ${
                ok ? "accept" : "reject"
            } char ${char} for range ${start}-${end}`, () => {
                let stateMachine = getStateMachine().asStateMachine();
                while (stateMachine.status === Status.Pending) {
                    stateMachine.next(char);
                }
                if (ok) {
                    expect(stateMachine.status).toEqual(Status.Ok);
                    expect(stateMachine.unconsumedInputs).toEqual([]);
                    if (stateMachine.status === Status.Ok) {
                        expect(stateMachine.value).toEqual(char);
                    }
                } else {
                    expect(stateMachine.status).toEqual(Status.Error);
                    expect(stateMachine.unconsumedInputs).toEqual([char]);
                }
            })
        );
    }
});
