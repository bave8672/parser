import { Status } from "../../../result/result";
import { RegexStateMachine } from "./regex_state_machine";

describe(`Regex state machine`, () => {
    describe(`Exact matching`, () => {
        testMatch({
            name: `Matches a simple regex`,
            pattern: "abc",
            input: "abcd",
            match: true,
            expectedValue: "abc",
            expectedUnconsumedInputs: ["d"],
        });
    
        testMatch({
            name: `Errors when no match is found`,
            pattern: "abc",
            input: "z",
            match: false,
            expectedUnconsumedInputs: ["z"],
        });
    });

    describe(`Escaped characters`, () => {
        testMatch({
            name: `Matches an escaped character`,
            pattern: "\\\\",
            input: "\\",
            match: true,
            expectedValue: "\\",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Errors when no match is found`,
            pattern: "\\\\",
            input: "\/\/",
            match: false,
            expectedUnconsumedInputs: ["/", "/"],
        });
    });

    describe(`Wildcard "." character`, () => {
        testMatch({
            name: `Matches "a"`,
            pattern: "a.a",
            input: "aaa",
            match: true,
            expectedValue: "aaa",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Matches "b"`,
            pattern: "a.a",
            input: "aba",
            match: true,
            expectedValue: "aba",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Matches "?"`,
            pattern: "a.a",
            input: "a?a",
            match: true,
            expectedValue: "a?a",
            expectedUnconsumedInputs: [],
        });
    });

    describe(`Word "\\w" character`, () => {
        testMatch({
            name: `Matches "abc"`,
            pattern: "\\w\\w\\w",
            input: "abc",
            match: true,
            expectedValue: "abc",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Matches "123"`,
            pattern: "\\w\\w\\w",
            input: "123",
            match: true,
            expectedValue: "123",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Does not match punctuation`,
            pattern: "\\w\\w\\w",
            input: "ab!",
            match: false,
            expectedValue: "a?a",
            expectedUnconsumedInputs: ['a', 'b', '!'],
        });
    });

    describe(`Negated word "\\W" character`, () => {
        testMatch({
            name: `Matches "abc"`,
            pattern: "\\W\\W\\W",
            input: "abc",
            match: false,
            expectedUnconsumedInputs: ['a', 'b', 'c'],
        });
        testMatch({
            name: `Matches "123"`,
            pattern: "\\W\\W\\W",
            input: "123",
            match: false,
            expectedUnconsumedInputs: ['1', '2', '3'],
        });
        testMatch({
            name: `Matches punctuation & whitespace`,
            pattern: "\\W\\W\\W",
            input: "? #",
            match: true,
            expectedValue: "? #",
            expectedUnconsumedInputs: [],
        });
    });

    describe(`Digit "\\d" character`, () => {
        testMatch({
            name: `Matches "123"`,
            pattern: "\\d\\d\\d",
            input: "123",
            match: true,
            expectedValue: "123",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Does not match alphas "123"`,
            pattern: "\\d\\d\\d",
            input: "abc",
            match: false,
            expectedUnconsumedInputs: ['a', 'b', 'c'],
        });
        testMatch({
            name: `Does not match punctuation`,
            pattern: "\\d\\d\\d",
            input: "!",
            match: false,
            expectedUnconsumedInputs: ['!'],
        });
    });

    describe(`Negated digit "\\D" character`, () => {
        testMatch({
            name: `Does not match "123"`,
            pattern: "\\D\\D\\D",
            input: "123",
            match: false,
            expectedValue: "123",
            expectedUnconsumedInputs: ['1', '2', '3'],
        });
        testMatch({
            name: `Matches alpha & punctuation & space`,
            pattern: "\\D\\D\\D",
            input: "! P",
            match: true,
            expectedValue: "! P",
            expectedUnconsumedInputs: [],
        });
    });

    describe(`Whitespace "\\w" character`, () => {
        testMatch({
            name: `Matches spaces "   "`,
            pattern: "\\s\\s\\s",
            input: "   ",
            match: true,
            expectedValue: "   ",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Matches tabs "\t\t\t"`,
            pattern: "\\s\\s\\s",
            input: "\t\t\t",
            match: true,
            expectedValue: "\t\t\t",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Does not match alphas "123"`,
            pattern: "\\s\\s\\s",
            input: "abc",
            match: false,
            expectedUnconsumedInputs: ['a', 'b', 'c'],
        });
        testMatch({
            name: `Does not match punctuation`,
            pattern: "\\s\\s\\s",
            input: "!",
            match: false,
            expectedUnconsumedInputs: ['!'],
        });
    });

    describe(`Negated whitespace "\\W" character`, () => {
        testMatch({
            name: `errors on spaces "   "`,
            pattern: "\\S\\S\\S",
            input: "   ",
            match: false,
            expectedUnconsumedInputs: [' ', ' ', ' '],
        });
        testMatch({
            name: `errors on tabs "\t\t\t"`,
            pattern: "\\S\\S\\S",
            input: "\t\t\t",
            match: false,
            expectedUnconsumedInputs: ['\t', '\t', '\t'],
        });
        testMatch({
            name: `Matches alphas, punctuation & digits`,
            pattern: "\\S\\S\\S",
            input: "!1X",
            match: true,
            expectedValue: '!1X',
            expectedUnconsumedInputs: [],
        });
    });

    describe(`Optional "?" operator`, () => {
        testMatch({
            name: `implements optional with no matches`,
            pattern: "ab?a",
            input: "aa",
            match: true,
            expectedValue: "aa",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `implements optional with one match`,
            pattern: "ab?a",
            input: "aba",
            match: true,
            expectedValue: "aba",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Errors with multiple matches`,
            pattern: "ab?a",
            input: "abba",
            match: false,
            expectedUnconsumedInputs: ['a', 'b', 'b', 'a'],
        });
    });

    describe(`Kleene star operator`, () => {
        testMatch({
            name: `implements the Kleene star with no matches`,
            pattern: "ab*a",
            input: "aa",
            match: true,
            expectedValue: "aa",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `implements the Kleene star with one match`,
            pattern: "ab*a",
            input: "aba",
            match: true,
            expectedValue: "aba",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `implements the Kleene star with multiple matches`,
            pattern: "ab*a",
            input: "abba",
            match: true,
            expectedValue: "abba",
            expectedUnconsumedInputs: [],
        });
    });

    describe(`Kleene plus operator`, () => {
        testMatch({
            name: `implements the Kleene plus, errors on no match`,
            pattern: "ab+a",
            input: "aa",
            match: false,
            expectedUnconsumedInputs: ['a', 'a'],
        });
        testMatch({
            name: `implements the Kleene plus, with a single match`,
            pattern: "ab+a",
            input: "aba",
            match: true,
            expectedValue: "aba",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `implements the Kleene plus, with a multiple matches`,
            pattern: "ab+a",
            input: "abba",
            match: true,
            expectedValue: "abba",
            expectedUnconsumedInputs: [],
        });
    });

    describe('Repetitions', () => {
        testMatch({
            name: `implements fixed repetitions`,
            pattern: "a{3}",
            input: "aaa",
            match: true,
            expectedValue: "aaa",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `implements range repetitions below the limit`,
            pattern: "a{3,5}",
            input: "aaab",
            match: true,
            expectedValue: "aaa",
            expectedUnconsumedInputs: ['b'],
        });
        testMatch({
            name: `implements range repetitions reaching the limit`,
            pattern: "a{3,5}",
            input: "aaaaa",
            match: true,
            expectedValue: "aaaaa",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `implements an open ended range`,
            pattern: "a{3,}",
            input: "aaaab",
            match: true,
            expectedValue: "aaaa",
            expectedUnconsumedInputs: ['b'],
        });
    });

    describe(`Sets`, () => {
        testMatch({
            name: `Should match an exact match of a set of one`,
            pattern: "[a]",
            input: "a",
            match: true,
            expectedValue: "a",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match any element of the set`,
            pattern: "[abc]",
            input: "b",
            match: true,
            expectedValue: "b",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match any element of the set`,
            pattern: "[abc]",
            input: "c",
            match: true,
            expectedValue: "c",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should error when none are matched`,
            pattern: "[abc]",
            input: "z",
            match: false,
            expectedUnconsumedInputs: ['z'],
        });
    });

    describe(`Ranges`, () => {
        testMatch({
            name: `Should match any element in the range`,
            pattern: "[a-c]",
            input: "a",
            match: true,
            expectedValue: "a",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match any element in the range`,
            pattern: "[a-c]",
            input: "b",
            match: true,
            expectedValue: "b",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match any element in the range`,
            pattern: "[a-c]",
            input: "c",
            match: true,
            expectedValue: "c",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should error when outside the range`,
            pattern: "[abc]",
            input: "z",
            match: false,
            expectedUnconsumedInputs: ['z'],
        });
        testMatch({
            name: `Should match against multiple ranges`,
            pattern: "[a-z0-9]",
            input: "j",
            match: true,
            expectedValue: "j",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match against multiple ranges`,
            pattern: "[a-z0-9]",
            input: "6",
            match: true,
            expectedValue: "6",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should error against multiple ranges`,
            pattern: "[a-z0-9]",
            input: "G",
            match: false,
            expectedUnconsumedInputs: ['G'],
        });
        testMatch({
            name: `Should match when mixed with exact matches`,
            pattern: "[a0-9]",
            input: "a",
            match: true,
            expectedValue: "a",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match when mixed with exact matches`,
            pattern: "[a0-9]",
            input: "0",
            match: true,
            expectedValue: "0",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should match when mixed with exact matches`,
            pattern: "[a0-9]",
            input: "b",
            match: false,
            expectedUnconsumedInputs: ['b'],
        });
        testMatch({
            name: `Should work with optional operator`,
            pattern: "a[x-z]?b",
            input: "ab",
            match: true,
            expectedValue: "ab",
            expectedUnconsumedInputs: [],
        });
        testMatch({
            name: `Should work with Kleene plus & escaped values`,
            pattern: "[\\w\\s]+",
            input: "The quick brown fox.",
            match: true,
            expectedValue: "The quick brown fox",
            expectedUnconsumedInputs: ['.'],
        });
        testMatch({
            name: `Should work with Kleene star & escaped values`,
            pattern: "[\\w\\s]*",
            input: "The quick brown fox.",
            match: true,
            expectedValue: "The quick brown fox",
            expectedUnconsumedInputs: ['.'],
        });
        testMatch({
            name: `Should error with Kleene plus & escaped values`,
            pattern: "[\\w\\s]+",
            input: ".",
            match: false,
            expectedUnconsumedInputs: ['.'],
        });
        testMatch({
            name: `Should negate`,
            pattern: "[^\\dx-z]*",
            input: "The quick brown fox",
            match: true,
            expectedValue: "The quick brown fo",
            expectedUnconsumedInputs: ['x'],
        });
    });

    describe(`Groups`, () => {
        testMatch({
            name: `Should match when mixed with exact matches`,
            pattern: "(a)",
            input: "a",
            match: true,
            expectedValue: "a",
            expectedUnconsumedInputs: [],
        });
    });

    function testMatch(spec: {
        name: string;
        pattern: string;
        input: string;
        match: boolean;
        expectedValue?: string;
        expectedUnconsumedInputs: string[];
    }) {
        it(`${spec.name} ::= pattern ${spec.pattern} ${
            spec.match ? "should" : "should not"
        } match ${spec.input}`, () => {
            let stateMachine;;
            try {
                stateMachine = new RegexStateMachine(
                    spec.pattern
                ).asStateMachine()
                if (stateMachine.status === Status.Pending) {
                    stateMachine.play(...spec.input.split(""));
                }
                if (spec.match) {
                    expect(stateMachine.status).toEqual(Status.Ok);
                    if (stateMachine.status === Status.Ok) {
                        expect(stateMachine.value).toEqual(spec.expectedValue);
                    }
                } else {
                    expect(stateMachine.status).toEqual(Status.Error);
                }
                expect(stateMachine.unconsumedInputs).toEqual(
                    spec.expectedUnconsumedInputs
                );
            } catch (err) {
                console.log(JSON.stringify(stateMachine, undefined, '    '));
                debugger;
                throw err;
            }
        });
    }
});
