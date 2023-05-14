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

describe("test function is_mobile_screen_size", () => {
    let originalWindow = { ...window };
    let windowSpy: any;

    beforeEach(() => {
        windowSpy = jest.spyOn(global, "window", "get");
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    test("test mobile size", () => {
        windowSpy.mockImplementation(
            () =>
                ({
                    ...originalWindow,
                    innerWidth: 50,
                } as typeof window)
        );

        expect(util_functions.is_mobile_screen_size()).toEqual(true);
    });

    test("test desctop size", () => {
        windowSpy.mockImplementation(
            () =>
                ({
                    ...originalWindow,
                    innerWidth: 770,
                } as typeof window)
        );

        expect(util_functions.is_mobile_screen_size()).toEqual(false);
    });
});

test("test function get_text_date", () => {
    const case1 = util_functions.get_text_date();
    expect(case1.day_numUTC).toBe(new Date().getUTCDate().toString());

    const case2_date = new Date();
    case2_date.setUTCFullYear(2000, 0, 1);
    case2_date.setUTCHours(12, 10);
    const case2 = util_functions.get_text_date(case2_date);
    expect(case2.day_numUTC).toBe("1");
    expect(case2.hoursUTC).toBe("12");
    expect(case2.year_numUTC).toBe("2000");
    expect(case2.minutesUTC).toBe("10");

    const case3 = util_functions.get_text_date(case2_date.getTime());
    expect(case3.day_numUTC).toBe("1");
    expect(case3.hoursUTC).toBe("12");
    expect(case2.year_numUTC).toBe("2000");
    expect(case2.minutesUTC).toBe("10");
});

test("test function add_to_macro_stack", () => {
    jest.useFakeTimers();
    const fn = jest.fn(() => {});

    util_functions.add_to_macro_stack(fn);
    jest.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
});

test("test function calc_sun_hours_details", () => {
    const funcResult = util_functions.calc_sun_hours_details(1683954000, 1684011600, 7200);

    expect(funcResult.sunrise.hours).toBe(7);
    expect(funcResult.sunrise.minutes).toBe(0);
    expect(funcResult.sunrise.timestamp).toBe(1683961200000);

    expect(funcResult.sunset.hours).toBe(23);
    expect(funcResult.sunset.minutes).toBe(0);
    expect(funcResult.sunset.timestamp).toBe(1684018800000);
});

test("test function calc_weather_day_time", () => {
    const sun_data = {
        sunrise: { hours: 7, minutes: 0, timestamp: 1683961200000 },
        sunset: { hours: 23, minutes: 0, timestamp: 1684018800000 },
    };

    const time_data1 = { dt: 1683961199, timezone: 0 };
    const case1 = util_functions.calc_weather_day_time(sun_data, time_data1);
    expect(case1).toBe("NIGHT");

    const time_data2 = { dt: 1683961200, timezone: 0 };
    const case2 = util_functions.calc_weather_day_time(sun_data, time_data2);
    expect(case2).toBe("MORNING");

    const time_data3 = { dt: 1683961201, timezone: 0 };
    const case3 = util_functions.calc_weather_day_time(sun_data, time_data3);
    expect(case3).toBe("MORNING");

    const time_data4 = { dt: 1683972201, timezone: 0 };
    const case4 = util_functions.calc_weather_day_time(sun_data, time_data4);
    expect(case4).toBe("DAY");

    const time_data5 = { dt: 1684018700, timezone: 0 };
    const case5 = util_functions.calc_weather_day_time(sun_data, time_data5);
    expect(case5).toBe("EVENING");

    const time_data6 = { dt: 1684018801, timezone: 0 };
    const case6 = util_functions.calc_weather_day_time(sun_data, time_data6);
    expect(case6).toBe("NIGHT");
});

test("test function calc_backgraund_type", () => {
    const sun_data = {
        sunrise: { hours: 7, minutes: 0, timestamp: 1683961200000 },
        sunset: { hours: 23, minutes: 0, timestamp: 1684018800000 },
    };

    const weather_data1: any = { weather: [{ main: "clear", id: 600 }], dt: 1683961199, timezone: 0 };
    const case1 = util_functions.calc_backgraund_type(sun_data, weather_data1);
    expect(case1).toBe("night");

    const weather_data2: any = { weather: [{ main: "rain", id: 600 }], dt: 1683972201, timezone: 0 };
    const case2 = util_functions.calc_backgraund_type(sun_data, weather_data2);
    expect(case2).toBe("day_cloudy");

    const weather_data3: any = { weather: [{ main: "clear", id: 600 }], dt: 1683972201, timezone: 0 };
    const case3 = util_functions.calc_backgraund_type(sun_data, weather_data3);
    expect(case3).toBe("day");

    const weather_data4: any = { weather: [{ main: "clear", id: 702 }], dt: 1683961200, timezone: 0 };
    const case4 = util_functions.calc_backgraund_type(sun_data, weather_data4);
    expect(case4).toBe("morning_cloudy");
});

test("test function addon_map", () => {
    const case1 = util_functions.addon_map(5, 0, 10, 0, 100);
    expect(case1).toBe(50);

    const case2 = util_functions.addon_map(5, 0, 10, 50, 100);
    expect(case2).toBe(75);

    const case3 = util_functions.addon_map(5, 0, 10, -100, -50);
    expect(case3).toBe(-75);

    const case4 = util_functions.addon_map(-20, -40, 0, 10, 20);
    expect(case4).toBe(15);
});

test("test function convert_hpa_to_mmRtSt", () => {
    const case1 = util_functions.convert_hpa_to_mmRtSt({ pressure: 12, grnd_level: 24 });
    expect(case1).toBe(9);

    const case2 = util_functions.convert_hpa_to_mmRtSt({ pressure: 12, grnd_level: undefined });
    expect(case2).toBe(9);

    const case3 = util_functions.convert_hpa_to_mmRtSt({ pressure: undefined, grnd_level: 24 });
    expect(case3).toBe(18);
});

test("test function delete_obj_from_array", () => {
    const data = [
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
        { a: { g: 1 }, b: ["a", 1, { a: 1 }] },
    ];

    expect(util_functions.delete_obj_from_array(data, { a: "sd", s: 44 })).toEqual([
        { a: 1, b: 2 },
        { a: { g: 1 }, b: ["a", 1, { a: 1 }] },
    ]);

    expect(util_functions.delete_obj_from_array(data, { a: { g: 1 }, b: ["a", 1, { a: 1 }] })).toEqual([
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
    ]);
});

test("test function unshuft_unique_obj_to_array_force", () => {
    const data = [
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
        { a: [1, 2, 3], b: "sdsd" },
    ];

    expect(util_functions.unshuft_unique_obj_to_array_force(data, { a: "sd", s: 44 })).toEqual([
        { a: "sd", s: 44 },
        { a: 1, b: 2 },
        { a: [1, 2, 3], b: "sdsd" },
    ]);

    expect(util_functions.unshuft_unique_obj_to_array_force(data, { a: 1, b: 2 })).toEqual([
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
        { a: [1, 2, 3], b: "sdsd" },
    ]);

    expect(util_functions.unshuft_unique_obj_to_array_force(data, { a: 22, b: 33 })).toEqual([
        { a: 22, b: 33 },
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
        { a: [1, 2, 3], b: "sdsd" },
    ]);

    expect(util_functions.unshuft_unique_obj_to_array_force(data, { a: [1, 2, 3], b: "sdsd" })).toEqual([
        { a: [1, 2, 3], b: "sdsd" },
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
    ]);
});

test("test function unshuft_unique_obj_to_array", () => {
    const data = [
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
    ];

    expect(util_functions.unshuft_unique_obj_to_array(data, { a: 1111, s: 444 })).toEqual([
        { a: 1111, s: 444 },
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
    ]);

    expect(util_functions.unshuft_unique_obj_to_array(data, { a: "sd", s: 44 })).toEqual([
        { a: 1, b: 2 },
        { a: "sd", s: 44 },
    ]);
});

describe("test function update_meta_desc", () => {
    let data = { content: "" };
    let querySelectorSpy: any;

    beforeEach(() => {
        querySelectorSpy = jest.spyOn(document, "querySelector");

        querySelectorSpy.mockImplementation(() => {
            return {
                querySelector: (selector: string) => {
                    return data;
                },
            } as any;
        });
    });

    afterEach(() => {
        querySelectorSpy.mockRestore();
    });

    test("test city named", () => {
        util_functions.update_meta_desc("SSS");
        expect(data).toEqual({
            content: `Подробный прогноз погоды в SSS, на сегодня, завтра, 5 дней, в weather-app. Прогноз погоды в SSS с точностью '+-25 %'`,
        });
    });

    test("test city not named", () => {
        util_functions.update_meta_desc(undefined);
        expect(data).toEqual({
            content: `Подробный прогноз погоды , на сегодня, завтра, 5 дней, в weather-app. Прогноз погоды  с точностью '+-25 %'`,
        });
    });
});

describe("test function get_localed_city_name", () => {
    let navigatorSpy: jest.SpyInstance<string>;
    let data = { local_names: { ru228: "test ok" }, name: "SSS" };

    beforeEach(() => {
        navigatorSpy = jest.spyOn(global.window.navigator, "language", "get");
    });

    afterEach(() => {
        navigatorSpy.mockRestore();
    });

    test("test use locale", () => {
        navigatorSpy.mockImplementationOnce(() => {
            return "ru228";
        });
        expect(util_functions.get_localed_city_name(data as any)).toEqual("test ok");
    });

    test("test use name", () => {
        navigatorSpy.mockImplementationOnce(() => {
            return "none";
        });
        expect(util_functions.get_localed_city_name(data as any)).toEqual("SSS");
    });
});

describe("test function get_system_language", () => {
    let navigatorSpy: jest.SpyInstance<string>;

    beforeEach(() => {
        navigatorSpy = jest.spyOn(global.window.navigator, "language", "get");

        navigatorSpy.mockImplementationOnce(() => {
            return "ru228";
        });
    });

    afterEach(() => {
        navigatorSpy.mockRestore();
    });

    test("test", () => {
        expect(util_functions.get_system_language()).toEqual("ru228");
    });
});
