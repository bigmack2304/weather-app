import * as fetch_current_weather from "./fetch_5d3h_weather";

jest.mock("./global_vars", () => {
    const originalModule = jest.requireActual("./global_vars");

    return {
        __esModule: true,
        ...originalModule,
        WEATHER_API_KEY: "0000c0000c0000c0000",
    };
});

describe("test fetch_5d3h_weather.ts", () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let consoleGroupSpy: jest.SpyInstance;
    let consoleGroupEndSpy: jest.SpyInstance;
    let consoleWarnEndSpy: jest.SpyInstance;
    let fetchSpy: jest.SpyInstance;
    let fn_on_response: (val: any) => void;
    let fn_on_error: () => void;
    let get_adress = ""; // с каким адресом был сделан запрос
    let return_response: any = {}; // тут указываем что должен вернуть fetch.json

    beforeAll(() => {
        fn_on_response = jest.fn((val) => val);
        fn_on_error = jest.fn(() => {});
        consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(global.console, "error").mockImplementation(() => {});
        consoleGroupSpy = jest.spyOn(global.console, "group").mockImplementation(() => {});
        consoleGroupEndSpy = jest.spyOn(global.console, "groupEnd").mockImplementation(() => {});
        consoleWarnEndSpy = jest.spyOn(global.console, "warn").mockImplementation(() => {});
        fetchSpy = jest.spyOn(global, "fetch");
    });

    afterAll(() => {
        fetchSpy.mockRestore();
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        consoleGroupSpy.mockRestore();
        consoleGroupEndSpy.mockRestore();
        consoleWarnEndSpy.mockRestore();
    });

    beforeEach(() => {
        fetchSpy.mockImplementation((adress) => {
            return new Promise((resolve, reject) => {
                resolve({
                    json: () => {
                        return new Promise((resolve) => {
                            get_adress = adress.toString();
                            resolve(return_response);
                        });
                    },
                } as any);
            });
        });
    });

    afterEach(() => {
        get_adress = "";
        return_response = {};
    });

    test("test fetch current adress", async () => {
        // проверяем правильность урла при запросе

        await fetch_current_weather.fetch_5d3h_weather({ callBack: fn_on_response, errorCallback: fn_on_error, lat: 0, lon: 0 });
        expect(get_adress).toBe(
            "https://api.openweathermap.org/data/2.5/forecast?lat=0&lon=0&units=metric&lang=en&appid=0000c0000c0000c0000"
        );
    });

    test("test fetch response", async () => {
        // пришел какойто ответ с данными
        await fetch_current_weather.fetch_5d3h_weather({ callBack: fn_on_response, errorCallback: fn_on_error, lat: 0, lon: 0 });
        expect(fn_on_response).toHaveBeenCalledWith({});

        // пришел какойто ответ с данными
        return_response = { a: "1212" };
        await fetch_current_weather.fetch_5d3h_weather({ callBack: fn_on_response, errorCallback: fn_on_error, lat: 0, lon: 0 });
        expect(fn_on_response).toHaveBeenCalledWith({ a: "1212" });

        // пришел какойто ответ с данными
        return_response = { cod: "200" };
        await fetch_current_weather.fetch_5d3h_weather({ callBack: fn_on_response, errorCallback: fn_on_error, lat: 0, lon: 0 });
        expect(fn_on_response).toHaveBeenCalledWith({ cod: "200" });
    });

    test("test fetch error", async () => {
        // пришел ответ с ошибкой
        return_response = { cod: 404 };
        await fetch_current_weather.fetch_5d3h_weather({ callBack: fn_on_response, errorCallback: fn_on_error, lat: 0, lon: 0 });
        expect(fn_on_error).toBeCalled();
    });
});
