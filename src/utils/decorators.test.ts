import * as decorators from "./decorators";

describe("test caller_delay_callback", () => {
    let counter = 0;
    let fn = decorators.caller_delay_callback(
        () => {
            counter++;
        },
        () => {},
        300
    );

    beforeAll(() => {
        jest.useFakeTimers();

        fn();
        fn();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.advanceTimersByTime(200);
    });

    test("test caller_delay_callback over 200ms", () => {
        expect(counter).toEqual(0);
    });

    test("test caller_delay_callback over 400ms", () => {
        expect(counter).toEqual(1);
    });

    test("test caller_delay_callback over 600ms", () => {
        expect(counter).toEqual(2);
    });
});

describe("test first_caller_delay_callback", () => {
    let counter = 0;

    let fn = decorators.first_caller_delay_callback(
        (val: number) => {
            counter = val;
        },
        () => {},
        300
    );

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("test 1", () => {
        fn(1);
        jest.advanceTimersByTime(200);
        expect(counter).toEqual(0);
    });

    test("test 2", () => {
        fn(2);
        jest.advanceTimersByTime(200);
        fn(3);
        jest.advanceTimersByTime(310);
        expect(counter).toEqual(3);
    });

    test("test 3", () => {
        fn(4);
        jest.advanceTimersByTime(310);
        expect(counter).toEqual(4);
    });
});

describe("test low_update_decorator", () => {
    let counter = 0;
    let fn = decorators.low_update_decorator(
        (val: number) => {
            counter = val;
        },
        () => {},
        300
    );

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("test 1", () => {
        fn(1);
        jest.advanceTimersByTime(200);
        expect(counter).toEqual(0);
    });

    test("test 2", () => {
        jest.advanceTimersByTime(101);
        expect(counter).toEqual(1);
    });

    test("test 3", () => {
        fn(2);
        jest.advanceTimersByTime(200);
        fn(3);
        jest.advanceTimersByTime(101);
        expect(counter).toEqual(3);
    });
});
