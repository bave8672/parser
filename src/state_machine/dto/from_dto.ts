import { illegalStateError } from "../../common/illegal_state_error";
import { AbstractStateMachine } from "../generic/abstract/abstract_state_machine";
import { ArrayStateMachine } from "../generic/array/array_state_machine";
import { EmptyStateMachine } from "../generic/empty/empty_state_machine";
import { GreedyStateMachine } from "../generic/greedy/greedy_state_machine";
import { LazyStateMachine } from "../generic/lazy/lazy_state_machine";
import { NotStateMachine } from "../generic/not/not_state_machine";
import { OneOrMoreStateMachine } from "../generic/one_or_more/one_or_more_state_machine";
import { StateMachine } from "../generic/state_machine";
import { ZeroOrMoreStateMachine } from "../generic/zero_or_more/zero_or_more_state_machine";
import { ConcatStateMachine } from "../string/concat/concat_state_machine";
import { ExactMatchStateMachine } from "../string/exact_match/exact_match_state_machine";
import { RangeStateMachine } from "../string/range/range_state_machine";
import { RegexStateMachine } from "../string/regex/regex_state_machine";
import { StateMachineId } from "./id";
import { DtoType, StateMachineDto, ValueDto } from "./dto";

export function fromDto<I = unknown, V = unknown, E = unknown>(dto: StateMachineDto) {
    const StateMachine = getStateMachineById(dto.id);
    const args = dto.args.map(hydrate);
    return new StateMachine(args).asStateMachine();
}

function hydrate(dto: StateMachineDto | ValueDto): StateMachine<unknown, unknown, unknown> | unknown {
    switch (dto.type) {
        case DtoType.StateMachine:
            return fromDto(dto);
        case DtoType.Value:
            return hydrateValue(dto);
        default:
            throw illegalStateError(dto, 'dto type');
    }
}

function hydrateValue<T = unknown>(dto: ValueDto<T>): T {
    return dto.value;
}

function getStateMachineById(id: StateMachineId): new (...args: any[]) => AbstractStateMachine<unknown, unknown, unknown> {
    switch (id) {
        // Generic
        case StateMachineId.Array:
            return ArrayStateMachine;
        case StateMachineId.Empty:
            return EmptyStateMachine;
        case StateMachineId.Greedy:
            return GreedyStateMachine;
        case StateMachineId.Lazy:
            return LazyStateMachine;
        case StateMachineId.Not:
            return NotStateMachine;
        case StateMachineId.OneOrMore:
            return OneOrMoreStateMachine;
        // String
        case StateMachineId.ZeroOrMore:
            return ZeroOrMoreStateMachine;
        case StateMachineId.Concat:
            return ConcatStateMachine;
        case StateMachineId.ExactMatch:
            return ExactMatchStateMachine;
        case StateMachineId.Range:
            return RangeStateMachine;
        case StateMachineId.Regex:
            return RegexStateMachine;
        default:
            throw illegalStateError(id, 'state machine id');
    }
}