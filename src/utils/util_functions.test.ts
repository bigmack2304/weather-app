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

test("test function is_mobile_screen_size", () => {
    // Setup
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, "window", "get");

    // tests
    windowSpy.mockImplementation(
        () =>
            ({
                ...originalWindow,
                innerWidth: 50,
            } as typeof window)
    );

    expect(util_functions.is_mobile_screen_size()).toEqual(true);

    windowSpy.mockImplementation(
        () =>
            ({
                ...originalWindow,
                innerWidth: 770,
            } as typeof window)
    );

    expect(util_functions.is_mobile_screen_size()).toEqual(false);

    // Cleanup
    windowSpy.mockRestore();
});

// test("test function get_text_date", () => {

//     expect(util_functions.get_text_date()).toEqual(false);
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

// test("test function GetElementOffsetsInDocument", async function () {
//     // const case1 = util_functions.convert_hpa_to_mmRtSt({ pressure: 12, grnd_level: 24 });
//     // expect(case1).toBe(9);

//     // convert output to actual HTML

//     // const nodeWrapper = document.createElement("div");
//     // nodeWrapper.style.marginLeft = "10px";

//     // const nodeItem1 = document.createElement("div");
//     // nodeItem1.classList.add("item1");

//     // const nodeItem2 = document.createElement("div");
//     // nodeItem2.classList.add("item2");
//     // nodeItem2.style.marginLeft = "10px";

//     // const nodeItem3 = document.createElement("div");
//     // nodeItem3.classList.add("item3");

//     // nodeWrapper.append(nodeItem1, nodeItem2);
//     // document.body.append(nodeWrapper, nodeItem3);

//     // const item1 = document.querySelector(".item1") as HTMLElement;
//     // const item2 = document.querySelector(".item2") as HTMLElement;
//     // const item3 = document.querySelector(".item3") as HTMLElement;

//     // // Test the attributes that matter to you as normal HTML
//     // expect(util_functions.GetElementOffsetsInDocument(item1)).toEqual({ top: 0, left: 0 });
//     // expect(util_functions.GetElementOffsetsInDocument(item2)).toEqual({ top: 0, left: 0 });
//     // expect(util_functions.GetElementOffsetsInDocument(item3)).toEqual({ top: 0, left: 0 });

//     ////////////////////////////////////////////////////////////////////////////////

//     render(
//         <div>
//             <div style={{ marginLeft: "10px" }}>
//                 <div>item1</div>
//                 <div>item2</div>
//             </div>
//             <div>item3</div>
//         </div>
//     );

//     let item1 = screen.getByText("item1");
//     let item2: HTMLElement;
//     let item3: HTMLElement;

//     console.log(item1.parentElement!.offsetLeft);
//     // Test the attributes that matter to you as normal HTML

//     expect(item1.parentElement).toHaveStyle("");
//     expect(util_functions.GetElementOffsetsInDocument(item1!)).toEqual({ top: 0, left: 0 });
//     // expect(util_functions.GetElementOffsetsInDocument(item2!)).toEqual({ top: 0, left: 0 });
//     // expect(util_functions.GetElementOffsetsInDocument(item3!)).toEqual({ top: 0, left: 0 });

//     // expect(item1.then((value)=>{})).toBeTruthy();

//     /////////////////////////////////////////////////////////////////////////////////
// });
