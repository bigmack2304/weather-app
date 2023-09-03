import reducer, { updatePageSelector, updateBackgroundClass } from "../slises/homePage";
import type { IHomePageSlice } from "../slises/homePage";

describe("tests homePageSlice", () => {
    let store: IHomePageSlice;

    beforeAll(() => {
        store = reducer(undefined, { type: "" });
    });

    test("test default state", () => {
        expect(store).toEqual({ pageSelector: undefined, backgroundClass: undefined });
    });

    test("test action updatePageSelector", () => {
        store = reducer(store, updatePageSelector(".unit_test"));
        expect(store).toEqual({ pageSelector: ".unit_test", backgroundClass: undefined });
    });

    test("test action updateBackgroundClass", () => {
        store = reducer(store, updateBackgroundClass("test_class"));
        expect(store).toEqual({ pageSelector: ".unit_test", backgroundClass: "test_class" });
    });
});
