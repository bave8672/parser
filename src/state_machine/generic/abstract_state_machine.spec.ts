import { Status } from "../../result/result";
import { AbstractStateMachine } from "./abstract_state_machine";

describe(`AbstractStateMachine`, () => {
    describe(`Counter example`, () => {
        /** Counts ticks until limit is reached */
        class Counter extends AbstractStateMachine<void, number, string> {
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

        it(`should count to three`, () => {
            let timer = new Counter(3).asStateMachine();
            while(timer.status === Status.Pending) {
                timer = timer.next();
            }
            if (timer.status === Status.Ok) {
                expect(timer.value).toBe(3);
            } else {
                throw new Error(`Expected OK`);
            }
        });
    });

    describe(`Limited counter example`, () => {
        /** Sums input, erroring if the limit is exceeded */
        class Counter extends AbstractStateMachine<number, number, string> {
            private count = 0;

            constructor(private readonly limit: number) {
                super();
            }

            next(value: number) {
                this.count += value;
                if (this.count === this.limit) {
                    this.complete(this.count);
                } else if (this.count > this.limit) {
                    this.fail(`Exceeded limit: ${this.count}`);
                }
                return this;
            }
        }

        it(`should count to three`, () => {
            let timer = new Counter(3).asStateMachine();
            while(timer.status === Status.Pending) {
                timer = timer.next(1);
            }
            if (timer.status === Status.Ok) {
                expect(timer.value).toBe(3);
            } else {
                throw new Error(`Expected OK`);
            }
        });

        it(`should fail`, () => {
            let timer = new Counter(3).asStateMachine();
            while(timer.status === Status.Pending) {
                timer = timer.next(10);
            }
            if (timer.status === Status.Error) {
                expect(timer.error).toBe(`Exceeded limit: 10`);
            } else {
                throw new Error(`Expected Error`);
            }
        });
    });
});
