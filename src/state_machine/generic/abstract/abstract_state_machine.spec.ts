import { Pending, Status } from "../../../result/result";
import { AbstractStateMachine } from "./abstract_state_machine";
import { StateMachine } from "../state_machine";

describe(`AbstractStateMachine`, () => {
    /** Counts ticks until limit is reached */
    class SimpleCounter extends AbstractStateMachine<void, number, string> {
        private count = 0;

        constructor(private readonly limit: number) {
            super();
        }

        next() {
            this.count++;
            if (this.count >= this.limit) {
                this.complete(this.count);
            }
            return this;
        }
    }

    interface LimitedCounterConstructor {
        new(limit: number): AbstractStateMachine<number, number, string>;
    }

    /** Sums input, erroring if the limit is exceeded */
    class LimitedCounter extends AbstractStateMachine<number, number, string> {
        private count = 0;

        constructor(private readonly limit: number) {
            super();
        }

        next(input: number) {
            this.count += input;
            if (this.count === this.limit) {
                this.complete(this.count);
            } else if (this.count > this.limit) {
                this.fail(`Exceeded limit: ${this.count}`);
                this.unconsumedInputs.push(input);
            }
            return this;
        }
    }

    function testLimitedCounter(Counter: LimitedCounterConstructor) {
        describe(`Limited counter example`, () => {
            it(`should count to three`, () => {
                let counter = new Counter(3).asStateMachine();
                while(counter.status === Status.Pending) {
                    counter = counter.next(1);
                }
                if (counter.status === Status.Ok) {
                    expect(counter.value).toBe(3);
                    expect(counter.unconsumedInputs).toEqual([]);
                } else {
                    throw new Error(`Expected OK`);
                }
            });
    
            it(`should fail`, () => {
                let counter = new Counter(3).asStateMachine();
                while(counter.status === Status.Pending) {
                    counter = counter.next(10);
                }
                if (counter.status === Status.Error) {
                    expect(counter.error).toBe(`Exceeded limit: 10`);
                    expect(counter.unconsumedInputs).toEqual([10]);
                } else {
                    throw new Error(`Expected Error`);
                }
            });
    
            it(`should play inputs until complete`, () => {
                const counter = new Counter(3).asStateMachine();
                while(counter.status === Status.Pending) {
                    counter.play(1, 2, 3, 4, 5)
                }
                expect(counter.status).toBe(Status.Ok);
                expect(counter.unconsumedInputs).toEqual([3, 4, 5]);
            });
        });
    }

    describe(`Simple Counter example`, () => {
        it(`should count to three`, () => {
            let timer = new SimpleCounter(3).asStateMachine();
            while(timer.status === Status.Pending) {
                timer = timer.next();
            }
            if (timer.status === Status.Ok) {
                expect(timer.value).toBe(3);
                expect(timer.unconsumedInputs).toEqual([]);
            } else {
                throw new Error(`Expected OK`);
            }
        });
    });

    testLimitedCounter(LimitedCounter);

    describe(`Wrapped example`, () => {
        /** Wraps a child state machine and cop[ies result to itself] */
        class WrappedStateMachine<I, V, E> extends AbstractStateMachine<I, V, E> {
            constructor(private readonly wrapped: StateMachine<I, V, E>) {
                super();
            }

            next(input: I) {
                if (this.wrapped.status === Status.Pending) {
                    this.wrapped.next(input);
                }
                if (this.wrapped.status !== Status.Pending) {
                    this.copy(this.wrapped);
                }
                return this;
            }
        }

        /** Wraps the Limited Counter class */
        class WrappedLimitedCounter extends WrappedStateMachine<number, number, string> {
            constructor(private readonly limit: number) {
                super(new LimitedCounter(limit).asStateMachine());
            }
        }

        testLimitedCounter(WrappedLimitedCounter);
    });
});
