import { RegexStateMachine } from "../../string/regex/regex_state_machine";

/**
 * (* EBNF definition: *)
 * 
 * symbol = "[" | "]" | "{" | "}" | "(" | ")" | "<" | ">"
       | "'" | '"' | "=" | "|" | "." | "," | ";" ;
 */
export class SymbolStateMachine extends RegexStateMachine {
    constructor() {
        super(`[\[\]\{\}\(\)<>'"=\|\.,;]`)
    }
}
