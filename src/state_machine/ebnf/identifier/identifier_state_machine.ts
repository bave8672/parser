import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { GreedyStateMachine } from "../../generic/greedy/greedy_state_machine";
import { ZeroOrMoreStateMachine } from "../../generic/zero_or_more/zero_or_more_state_machine";
import { ConcatStateMachine } from "../../string/concat/concat_state_machine";
import { DigitStateMachine } from "../../string/digit/digit_state_machine";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { LetterStateMachine } from "../../string/letter/letter_state_machine";
import { SymbolStateMachine } from "../symbol/symbol_state_machine";

/**
 * (* EBNF definition: *)
 *
 * identifier = letter , { letter | digit | "_" } ;
 */
export class IdentifierStateMachine extends ConcatStateMachine<string> {
    constructor() {
        super(
            new ArrayStateMachine(
                new LetterStateMachine().asStateMachine(),
                new ConcatStateMachine(
                    new ZeroOrMoreStateMachine(() =>
                        new GreedyStateMachine(
                            new LetterStateMachine().asStateMachine(),
                            new DigitStateMachine().asStateMachine(),
                            new ExactMatchStateMachine("_").asStateMachine(),
                        ).asStateMachine()
                    ).asStateMachine()
                ).asStateMachine()
            ).asStateMachine()
        );
    }
}
