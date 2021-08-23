import { Err, Ok, Pending, Result, Status } from "./result";

describe('Result', () => {
    it('should compile', () => {
        let result: Result<number, string> | undefined;
        for (let i = 0; i < 3; i++) {
            if (!result) {
                result = new Pending();
            } else if (result.status === Status.Pending) {
                result = new Err('error')
            } else if (result.status === Status.Error) {
                result = new Ok(1);
            }
        }
        expect(result!.status).toBe(Status.Ok);
        expect((result as Ok<number>).value).toBe(1);
    })
});
