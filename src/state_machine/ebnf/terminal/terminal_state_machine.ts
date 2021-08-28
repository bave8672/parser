import { ArrayStateMachine } from "../../generic/array/array_state_machine";
import { GreedyStateMachine } from "../../generic/greedy/greedy_state_machine";
import { ZeroOrMoreStateMachine } from "../../generic/zero_or_more/zero_or_more_state_machine";
import { ConcatStateMachine } from "../../string/concat/concat_state_machine";
import { DigitStateMachine } from "../../string/digit/digit_state_machine";
import { ExactMatchStateMachine } from "../../string/exact_match/exact_match_state_machine";
import { LetterStateMachine } from "../../string/letter/letter_state_machine";
import { AnonymousSyntaxStateMachine } from "../../syntax/anonymous_state_machine";
import { SyntaxStateMachine } from "../../syntax/syntax_state_machine";
import { CharacterStateMachine } from "../character/character_state_machine";
import { EBNFSyntaxType } from "../type/syntax_type";

/**
 * (* EBNF definition: *)
 *
 * terminal = "'" , character , { character } , "'"
 *       | '"' , character , { character } , '"' ;
 */
export class TerminalStateMachine extends SyntaxStateMachine {
    constructor() {
        super(
            EBNFSyntaxType.Terminal,
            new GreedyStateMachine(
                new ArrayStateMachine(
                    singleQuote(),
                    new CharacterStateMachine().asStateMachine(),
                    new AnonymousSyntaxStateMachine(
                        new ZeroOrMoreStateMachine(() =>
                            new CharacterStateMachine().asStateMachine()
                        ).asStateMachine()
                    ).asStateMachine(),
                    singleQuote()
                ).asStateMachine(),
                new ArrayStateMachine(
                    doubleQuote(),
                    new CharacterStateMachine().asStateMachine(),
                    new AnonymousSyntaxStateMachine(
                        new ZeroOrMoreStateMachine(() =>
                            new CharacterStateMachine().asStateMachine()
                        ).asStateMachine()
                    ).asStateMachine(),
                    doubleQuote(),
                ).asStateMachine()
            ).asStateMachine()
        );
    }
}

const singleQuote = () => new AnonymousSyntaxStateMachine(
    new ExactMatchStateMachine(`'`).asStateMachine()
).asStateMachine();

const doubleQuote = () => new AnonymousSyntaxStateMachine(
    new ExactMatchStateMachine(`"`).asStateMachine()
).asStateMachine();