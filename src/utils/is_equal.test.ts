import * as is_equal from "./is_equal";

describe("test is_equal.ts", () => {
    function foo() {
        let a = 1;
        a = a + 10;
        return a;
    }

    test("test function_is_equal (foo, foo) ", () => {
        expect(is_equal.function_is_equal(foo, foo)).toEqual(true);
    });

    test("test function_is_equal (foo, [native code])", () => {
        expect(is_equal.function_is_equal(foo, JSON.stringify)).toEqual(false);
    });

    test("test function_is_equal ([native code], [native code])", () => {
        expect(is_equal.function_is_equal(JSON.stringify, JSON.stringify)).toEqual(false);
    });

    test("test deep_array_is_equal", () => {
        const case1: any[] = [];
        const case2 = [1, 2, "3"];
        const case3 = [1, 2, [5, "6", 7]];
        const case4 = [1, 2, [5, "6", 7, [12, "14", "16"]]];
        const case5 = [1, 2, [5, "6", 7, { a: "sd", b: [1, 23, { a: 32, g: foo }] }]];
        const case6 = [1, 2, 4, [5, "6", 7, { a: "sd", b: [1, 23, { a: 32, g: JSON.stringify }] }]];

        expect(is_equal.deep_array_is_equal(case1, case1)).toBe(true);
        expect(is_equal.deep_array_is_equal(case4, case4)).toBe(true);
        expect(is_equal.deep_array_is_equal(case1, case2)).toBe(false);
        expect(is_equal.deep_array_is_equal(case2, case3)).toBe(false);
        expect(is_equal.deep_array_is_equal(case6, case6)).toBe(false);
        expect(is_equal.deep_array_is_equal(case5, case6)).toBe(false);
        expect(is_equal.deep_array_is_equal(case5, case5)).toBe(true);
    });

    test("test deep_object_is_equal", () => {
        const case1 = {};
        const case2 = { a: 1, b: "2" };
        const case3 = { a: 1, b: "2", c: [1, 2, "3"] };
        const case4 = { a: 1, b: "2", c: [1, 2, "3"], F: { a: 1, b: "2", c: [1, 2, "3"], ff: foo }, fgsd: [foo] };
        const case5 = {
            a: 1,
            b: "2",
            c: [1, 2, "3", { f: JSON.stringify, gf: foo, lk: ["12"] }],
            F: { a: 1, b: "2", c: [1, 2, "3"], ff: foo },
        };

        expect(is_equal.deep_object_is_equal(case1, case1)).toBe(true);
        expect(is_equal.deep_object_is_equal(case2, case2)).toBe(true);
        expect(is_equal.deep_object_is_equal(case3, case3)).toBe(true);
        expect(is_equal.deep_object_is_equal(case4, case4)).toBe(true);
        expect(is_equal.deep_object_is_equal(case5, case5)).toBe(false);
        expect(is_equal.deep_object_is_equal(case4, case5)).toBe(false);
        expect(is_equal.deep_object_is_equal(case4, case3)).toBe(false);
    });
});
