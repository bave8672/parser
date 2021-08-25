import { GreedyStateMachine } from "../../generic/greedy/greedy_state_machine";
import { NotStateMachine } from "../../generic/not/not_state_machine";
import { StateMachine } from "../../generic/state_machine";
import { ConcatStateMachine } from "../concat/concat_state_machine";
import { ExactMatchStateMachine } from "../exact_match/exact_match_state_machine";
import { KleenePlusStateMachine } from "../kleene_plus/kleene_plus_state_machine";
import { KleeneStarStateMachine } from "../kleene_star/kleene_star_state_machine";
import { RangeStateMachine } from "../range/range_state_machine";
import { WhitespaceStateMachine } from "../whitespace_state_machine/whitespace_state_machine";
import { WordStateMachine } from "../word_state_machine.ts/word_state_machine";

export class RegexStateMachineBuilder {
    constructor(private readonly pattern: string) {}

    private buildGroup(leftBracketIndex: number) {
        let rightBracketIndex = leftBracketIndex + 1;
        while (this.pattern[rightBracketIndex++] !== ")");
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
        let rightBracketIndex = leftBracketIndex + 1;
        while (this.pattern[rightBracketIndex++] !== "]");
        const createStateMachine = () => {
            const stateMachines: Array<StateMachine<string, string, string>> =
                [];
            let i = negate ? leftBracketIndex + 1 : leftBracketIndex;
            while (i < rightBracketIndex) {
                const char = this.pattern[i];
                if (char === "\\") {
                    // todo: escaped match
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
            return new GreedyStateMachine(...stateMachines).asStateMachine();
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
            case "s":
                return () => new WhitespaceStateMachine().asStateMachine();
            case "S":
                return () =>
                    new ConcatStateMachine(
                        new NotStateMachine(
                            new WhitespaceStateMachine().asStateMachine()
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

    public build(
        fromIndex = 0,
        toIndex = this.pattern.length
    ): StateMachine<string, string, string>[] {
        const stateMachines: StateMachine<string, string, string>[] = [];
        while (fromIndex < toIndex) {
            const char = this.pattern[fromIndex];
            let createStateMachine: () => StateMachine<string, string, string>;
            if (char === "(") {
                const group = this.buildGroup(fromIndex);
                createStateMachine = group.createStateMachine;
                fromIndex = group.rightBracketIndex;
            } else if (char === "[") {
                const set = this.buildSet(fromIndex);
                createStateMachine = set.createStateMachine;
                fromIndex = set.rightBracketIndex;
            } else if (char === "\\") {
                createStateMachine = this.buildEscaped(fromIndex);
                fromIndex++;
            } else {
                createStateMachine = () =>
                    new ExactMatchStateMachine(
                        this.pattern[fromIndex]
                    ).asStateMachine();
            }

            const nextChar = this.pattern[fromIndex + 1];
            if (nextChar === "*") {
                stateMachines.push(
                    new KleeneStarStateMachine(
                        createStateMachine
                    ).asStateMachine()
                );
            } else if (nextChar === "+") {
                stateMachines.push(
                    new KleenePlusStateMachine(
                        createStateMachine
                    ).asStateMachine()
                );
            } else {
                stateMachines.push(createStateMachine());
            }

            fromIndex++;
        }
        return stateMachines;
    }
}
