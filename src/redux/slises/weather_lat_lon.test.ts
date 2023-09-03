import reducer, {
    updateCity,
    setFetchError,
    setFetchLoading,
    setNotFound,
    setFetchData,
    fetchGeo,
    setAutoDetect,
} from "../slises/weather_lat_lon";
import type { IWeatherGeoSlice } from "../slises/weather_lat_lon";
import type { TFullResponse } from "../../utils/fetch_LatLon";

describe("tests homePageSlice", () => {
    let store: IWeatherGeoSlice;
    let defaultStore: IWeatherGeoSlice;
    let testCount = 1;

    beforeAll(() => {
        store = reducer(undefined, { type: "" });
        defaultStore = store;
    });

    beforeEach(() => {
        if (testCount !== 1) {
            store = defaultStore;
        }
    });

    afterEach(() => {
        testCount++;
    });

    test("test default state", () => {
        expect(store).toEqual({
            lat: undefined,
            lon: undefined,
            cityName: undefined,
            isFetchError: false,
            isFetchLoading: false,
            isNotFound: false,
            fetchData: undefined,
            isAutoDetect: false,
        });
    });

    test("test action updateCity", () => {
        store = reducer(store, updateCity({ lat: 1.1, lon: 1.2, cityName: "qwerty" }));
        expect(store).toEqual({
            ...defaultStore,
            lat: 1.1,
            lon: 1.2,
            cityName: "qwerty",
        });
    });

    test("test action setFetchError", () => {
        store = reducer(store, setFetchError(true));
        expect(store).toEqual({ ...defaultStore, isFetchError: true });
    });

    test("test action setFetchLoading", () => {
        store = reducer(store, setFetchLoading(true));
        expect(store).toEqual({ ...defaultStore, isFetchLoading: true });
    });

    test("test action setNotFound", () => {
        store = reducer(store, setNotFound(true));
        expect(store).toEqual({ ...defaultStore, isNotFound: true });
    });

    test("test action setFetchData", () => {
        store = reducer(store, setFetchData([{ country: "RU", lat: 123 }] as any as TFullResponse));
        expect(store).toEqual({ ...defaultStore, fetchData: [{ country: "RU", lat: 123 }] });
    });

    test("test action fetchGeo.fulfilled data", () => {
        store = reducer(
            store,
            fetchGeo.fulfilled([{ country: "RU", lat: 234, lon: 567, cityName: "qwerty1234" }] as any, "whay string?", {
                cityName: "qwerty1234",
                limit: 5,
            })
        );

        expect(store).toEqual({ ...defaultStore, fetchData: [{ country: "RU", lat: 234, lon: 567, cityName: "qwerty1234" }] });
    });

    test("test action fetchGeo.fulfilled no data", () => {
        store = reducer(
            store,
            fetchGeo.fulfilled([] as any, "whay string?", {
                cityName: "qwerty1234",
                limit: 5,
            })
        );

        expect(store).toEqual({ ...defaultStore, fetchData: [], isNotFound: true });
    });

    test("test action fetchGeo.pending", () => {
        store = reducer(store, fetchGeo.pending("", { cityName: "qwerty1234", limit: 5 }));

        expect(store).toEqual({ ...defaultStore, isFetchLoading: true });
    });

    test("test action fetchGeo.rejected", () => {
        store = reducer(store, fetchGeo.rejected(null, "", { cityName: "qwerty1234", limit: 5 }));

        expect(store).toEqual({ ...defaultStore, isFetchError: true });
    });

    test("test action setAutoDetect", () => {
        store = reducer(store, setAutoDetect(true));
        expect(store).toEqual({
            ...defaultStore,
            isAutoDetect: true,
        });
    });
});
