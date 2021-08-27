import { AbstractStateMachine } from "../../generic/abstract/abstract_state_machine";

/**
 * (* EBNF definition: *)
 * 
 * letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
 *     | "H" | "I" | "J" | "K" | "L" | "M" | "N"
 *     | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
 *     | "V" | "W" | "X" | "Y" | "Z" | "a" | "b"
 *     | "c" | "d" | "e" | "f" | "g" | "h" | "i"
 *     | "j" | "k" | "l" | "m" | "n" | "o" | "p"
 *     | "q" | "r" | "s" | "t" | "u" | "v" | "w"
 *     | "x" | "y" | "z" ;
 */
export class LetterStateMachine extends AbstractStateMachine<
    string,
    string,
    string
> {
    protected next(input: string) {
        if (input >= "A" && input <= "z") {
            this.complete(input);
        } else {
            this.unconsumedInputs.push(input);
            this.fail(`char ${input} is not a letter`);
        }
        return this;
    }
}
