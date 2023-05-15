import * as fetch_LatLon from "./fetch_LatLon";

jest.mock("./global_vars", () => {
    const originalModule = jest.requireActual("./global_vars");

    return {
        __esModule: true,
        ...originalModule,
        WEATHER_API_KEY: "0000c0000c0000c0000",
    };
});

describe("test fetch_LatLon.ts", () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let consoleGroupSpy: jest.SpyInstance;
    let consoleGroupEndSpy: jest.SpyInstance;
    let consoleWarnEndSpy: jest.SpyInstance;
    let fetchSpy: jest.SpyInstance;
    let fn_on_response: (val: any) => void;
    let fn_on_error: () => void;
    let get_adress = ""; // с каким адресом был сделан запрос
    let return_response: any = [{}]; // тут указываем что должен вернуть fetch.json

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
        return_response = [{}];
    });

    test("test fetch current adress", async () => {
        // проверяем правильность урла при запросе

        await fetch_LatLon.fetch_lat_lon({ callBack: fn_on_response, errorCallback: fn_on_error, cityName: "kemerovo", limit: 4 });
        expect(get_adress).toBe("https://api.openweathermap.org/geo/1.0/direct?q=kemerovo&limit=4&appid=0000c0000c0000c0000");
    });

    test("test fetch response", async () => {
        // пришел какойто ответ с данными
        await fetch_LatLon.fetch_lat_lon({ callBack: fn_on_response, errorCallback: fn_on_error, cityName: "kemerovo", limit: 4 });
        expect(fn_on_response).toHaveBeenCalledWith([{}]);

        // пришел какойто ответ с данными
        return_response = [{ a: "sdsdsd" }];
        await fetch_LatLon.fetch_lat_lon({ callBack: fn_on_response, errorCallback: fn_on_error, cityName: "kemerovo", limit: 4 });
        expect(fn_on_response).toHaveBeenCalledWith([{ a: "sdsdsd" }]);

        // пришел какойто ответ с данными
        return_response = { a: "1212" };
        await fetch_LatLon.fetch_lat_lon({ callBack: fn_on_response, errorCallback: fn_on_error, cityName: "kemerovo", limit: 4 });
        expect(fn_on_response).toHaveBeenCalledWith({ a: "1212" });
    });

    test("test fetch error", async () => {
        // пришел ответ с ошибкой
        return_response = { cod: 404 };
        await fetch_LatLon.fetch_lat_lon({ callBack: fn_on_response, errorCallback: fn_on_error, cityName: "kemerovo", limit: 4 });
        expect(fn_on_error).toBeCalled();

        // ответ пришел но он пустой
        return_response = [];
        await fetch_LatLon.fetch_lat_lon({ callBack: fn_on_response, errorCallback: fn_on_error, cityName: "kemerovo", limit: 4 });
        expect(fn_on_error).toBeCalled();
    });
});
