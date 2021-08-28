import { StateMachine } from "../generic/state_machine";
import { Syntax } from "./syntax";
import { ChildValue, SyntaxStateMachine } from "./syntax_state_machine";

export class AnonymousSyntaxStateMachine extends SyntaxStateMachine {
    constructor(child: StateMachine<
        string,
        ChildValue<Syntax>,
        string
    >) {
        super('anonymous', child);
    }
}