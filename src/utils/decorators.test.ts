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

describe("test cache_decorator", () => {
    let result: any;
    let call_count = 0;

    const test_fun1 = decorators.cache_decorator((a, b) => {
        call_count++;
        return a + b;
    });

    const test_fun2 = decorators.cache_decorator((a, b) => {
        call_count++;
        return { ...a, ...b };
    });

    test("test 1", () => {
        result = test_fun1(2, 3);
        expect(call_count).toBe(1);
        expect(result).toBe(5);
    });

    test("test 2", () => {
        result = test_fun1(4, 4);
        expect(call_count).toBe(2);
        expect(result).toBe(8);
    });

    test("test 3", () => {
        result = test_fun1(2, 3);
        expect(call_count).toBe(2);
        expect(result).toBe(5);
    });

    test("test 4", () => {
        result = test_fun2({ a: 1 }, { b: 2 });
        expect(call_count).toBe(3);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    test("test 5", () => {
        result = test_fun2({ a: 1 }, { b: 2 });
        expect(call_count).toBe(3);
        expect(result).toEqual({ a: 1, b: 2 });
    });

    test("test 5", () => {
        result = test_fun2({ a: 1 }, { b: 2 });
        expect(call_count).toBe(3);
        expect(result).toEqual({ a: 1, b: 2 });
    });
});
