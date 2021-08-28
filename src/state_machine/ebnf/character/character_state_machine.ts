import { GreedyStateMachine } from "../../generic/greedy/greedy_state_machine";
import { ZeroOrMoreStateMachine } from "../../generic/zero_or_more/zero_or_more_state_machine";
import { ConcatStateMachine } from "../../string/concat/concat_state_machine";
import { DigitStateMachine } from "../../string/digit/digit_state_machine";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { LetterStateMachine } from "../../string/letter/letter_state_machine";
import { Syntax } from "../../syntax/syntax";
import { SyntaxStateMachine } from "../../syntax/syntax_state_machine";
import { SymbolStateMachine } from "../symbol/symbol_state_machine";
import { EBNFSyntaxType } from "../type/syntax_type";

/**
 * (* EBNF definition: *)
 *
 * character = letter | digit | symbol | "_" ;
 */
export class CharacterStateMachine extends SyntaxStateMachine {
    constructor() {
        super(
            EBNFSyntaxType.Character,
            new ZeroOrMoreStateMachine(() =>
                new GreedyStateMachine<string, string, string>(
                    new LetterStateMachine().asStateMachine(),
                    new DigitStateMachine().asStateMachine(),
                    new SymbolStateMachine().asStateMachine(),
                    new ExactMatchStateMachine("_").asStateMachine(),
                ).asStateMachine()
            ).asStateMachine()
        );
    }
}

new CharacterStateMachine().asStateMachine()
