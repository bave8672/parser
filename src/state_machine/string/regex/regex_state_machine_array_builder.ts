import { GreedyStateMachine } from "../../generic/greedy/greedy_state_machine";
import { NotStateMachine } from "../../generic/not/not_state_machine";
import { OptionalStateMachine } from "../../generic/optional/optional_state_machine";
import { RepeatedStateMachine } from "../../generic/repeated/repeated_state_machine";
import { StateMachine } from "../../generic/state_machine";
import { WildcardStateMachine } from "../../generic/wildcard/wildcard_state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";
import { DigitStateMachine } from "../digit/digit_state_machine";
import { ExactMatchStateMachine } from "../exact_match/exact_match_state_machine";
import { KleenePlusStateMachine } from "../kleene_plus/kleene_plus_state_machine";
import { KleeneStarStateMachine } from "../kleene_star/kleene_star_state_machine";
import { RangeStateMachine } from "../range/range_state_machine";
import { WhitespaceStateMachine } from "../whitespace/whitespace_state_machine";
import { WordStateMachine } from "../word/word_state_machine";

export class RegexStateMachineArrayBuilder {
    constructor(private readonly pattern: string) {}

    private buildGroup(leftBracketIndex: number) {
        let rightBracketIndex = leftBracketIndex;
        while (this.pattern[++rightBracketIndex] !== ")");
        const createStateMachine = () =>
            ConcatStateMachine.fromArray(
                ...this.build(leftBracketIndex + 1, rightBracketIndex)
            ).asStateMachine();
        return {
            createStateMachine,
            rightBracketIndex,
        };
    }

    private buildSet(leftBracketIndex: number) {
        const negate = this.pattern[leftBracketIndex + 1] === "^";
        let rightBracketIndex = leftBracketIndex;
        while (this.pattern[++rightBracketIndex] !== "]");
        const createStateMachine = (): StateMachine<string, string, string> => {
            const stateMachines: Array<StateMachine<string, string, string>> =
                [];
            let i = negate ? leftBracketIndex + 1 : leftBracketIndex;
            while (i < rightBracketIndex) {
                const char = this.pattern[i];
                if (char === "\\") {
                    stateMachines.push(this.buildEscaped(i)());
                    i++;
                } else if (this.pattern[i + 1] === "-") {
                    i += 2;
                    stateMachines.push(
                        new RangeStateMachine(
                            char,
                            this.pattern[i]
                        ).asStateMachine()
                    );
                } else {
                    stateMachines.push(
                        new ExactMatchStateMachine(char).asStateMachine()
                    );
                }
                i++;
            }
            const setStateMachine = new GreedyStateMachine(
                ...stateMachines
            ).asStateMachine();
            if (negate) {
                return new ConcatStateMachine(
                    new NotStateMachine(setStateMachine).asStateMachine()
                ).asStateMachine();
            }
            return setStateMachine;
        };
        return {
            createStateMachine,
            rightBracketIndex,
        };
    }

    private buildEscaped(
        slashIndex: number
    ): () => StateMachine<string, string, string> {
        const char = this.pattern[slashIndex + 1];
        switch (char) {
            case "w":
                return () => new WordStateMachine().asStateMachine();
            case "W":
                return () =>
                    new ConcatStateMachine(
                        new NotStateMachine(
                            new WordStateMachine().asStateMachine()
                        ).asStateMachine()
                    ).asStateMachine();
            case "d":
                return () => new DigitStateMachine().asStateMachine();
            case "D":
                return () =>
                    new ConcatStateMachine(
                        new NotStateMachine(
                            new DigitStateMachine().asStateMachine()
                        ).asStateMachine()
                    ).asStateMachine();
            case "s":
                return () => new WhitespaceStateMachine().asStateMachine();
            case "S":
                return () =>
                    new ConcatStateMachine(
                        new NotStateMachine(
                            new WhitespaceStateMachine().asStateMachine()
                        ).asStateMachine()
                    ).asStateMachine();
            default:
                return () => new ExactMatchStateMachine(char).asStateMachine();
        }
    }

    private buildRepetition({
        createStateMachine,
        leftBracketIndex,
    }: {
        createStateMachine: () => StateMachine<string, string, string>;
        leftBracketIndex: number;
    }) {
        let rightBracketIndex = leftBracketIndex;
        let nLeft = "";
        let nRight = "";
        let encounteredComma = false;
        while (this.pattern[++rightBracketIndex] !== "}") {
            const char = this.pattern[rightBracketIndex];
            if (char === ",") {
                encounteredComma = true;
                continue;
            } else if (encounteredComma) {
                nRight += char;
            } else {
                nLeft += char;
            }
        }
        const min = nLeft ? Number(nLeft) : 0;
        const max = encounteredComma
            ? nRight
                ? Number(nRight)
                : Infinity
            : min;
        const stateMachine = new ConcatStateMachine(
            new RepeatedStateMachine({
                min,
                max,
                createChild: createStateMachine,
                mapError: undefined,
            }).asStateMachine()
        ).asStateMachine();
        return {
            stateMachine,
            rightBracketIndex,
        };
    }

    public build(
        fromIndex = 0,
        toIndex = this.pattern.length
    ): StateMachine<string, string, string>[] {
        const stateMachines: StateMachine<string, string, string>[] = [];
        while (fromIndex < toIndex) {
            const char = this.pattern[fromIndex];
            let createStateMachine: () => StateMachine<string, string, string>;
            switch (char) {
                case "(":
                    const group = this.buildGroup(fromIndex);
                    createStateMachine = group.createStateMachine;
                    fromIndex = group.rightBracketIndex;
                    break;
                case "[":
                    const set = this.buildSet(fromIndex);
                    createStateMachine = set.createStateMachine;
                    fromIndex = set.rightBracketIndex;
                    break;
                case "\\":
                    createStateMachine = this.buildEscaped(fromIndex);
                    fromIndex++;
                    break;
                case ".":
                    createStateMachine = () =>
                        new WildcardStateMachine<string>().asStateMachine();
                    break;
                default:
                    createStateMachine = () =>
                        new ExactMatchStateMachine(char).asStateMachine();
                    break;
            }

            const nextChar = this.pattern[fromIndex + 1];
            switch (nextChar) {
                case "?":
                    stateMachines.push(
                        new ConcatStateMachine(
                            new OptionalStateMachine(
                                createStateMachine()
                            ).asStateMachine()
                        ).asStateMachine()
                    );
                    fromIndex++;
                    break;
                case "*":
                    stateMachines.push(
                        new KleeneStarStateMachine(
                            createStateMachine
                        ).asStateMachine()
                    );
                    fromIndex++;
                    break;
                case "+":
                    stateMachines.push(
                        new KleenePlusStateMachine(
                            createStateMachine
                        ).asStateMachine()
                    );
                    fromIndex++;
                    break;
                case '{':
                    const { stateMachine, rightBracketIndex } = this.buildRepetition({ createStateMachine, leftBracketIndex: fromIndex + 1 });
                    stateMachines.push(stateMachine);
                    fromIndex = rightBracketIndex;
                    break;
                default:
                    stateMachines.push(createStateMachine());
                    break;
            }

            fromIndex++;
        }
        return stateMachines;
    }
}
