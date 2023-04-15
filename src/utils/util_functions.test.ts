import * as util_functions from "./util_functions";

test("test function number_to_deg360", () => {
    const case1 = util_functions.number_to_deg360(0);
    expect(case1).toBe(0);

    const case2 = util_functions.number_to_deg360(1);
    expect(case2).toBe(1);

    const case3 = util_functions.number_to_deg360(360);
    expect(case3).toBe(0);

    const case4 = util_functions.number_to_deg360(361);
    expect(case4).toBe(1);

    const case5 = util_functions.number_to_deg360(-2);
    expect(case5).toBe(2);
});

test("test function deg_invesion", () => {
    const case1 = util_functions.deg_invesion(0);
    expect(case1).toBe(180);

    const case2 = util_functions.deg_invesion(1);
    expect(case2).toBe(181);

    const case3 = util_functions.deg_invesion(361);
    expect(case3).toBe(181);

    const case4 = util_functions.deg_invesion(270);
    expect(case4).toBe(90);

    const case5 = util_functions.deg_invesion(-10);
    expect(case5).toBe(190);

    const case6 = util_functions.deg_invesion(-1);
    expect(case6).toBe(181);
});

test("test function to_positive_value", () => {
    const case1 = util_functions.to_positive_value(0);
    expect(case1).toBe(0);

    const case2 = util_functions.to_positive_value(1);
    expect(case2).toBe(1);

    const case3 = util_functions.to_positive_value(-5);
    expect(case3).toBe(5);

    const case4 = util_functions.to_positive_value(5);
    expect(case4).toBe(5);
});

test("test function deg_to_compass", () => {
    const case1 = util_functions.deg_to_compass(0);
    expect(case1).toBe("северный");

    const case2 = util_functions.deg_to_compass(45);
    expect(case2).toBe("северно-восточный");

    const case3 = util_functions.deg_to_compass(191);
    expect(case3).toBe("южный");
});
