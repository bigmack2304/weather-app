import * as util_HashAddressBar from "./util_HashAddressBar";

describe("test util_HashAddressBar.ts", () => {
    test("test get", () => {
        expect(util_HashAddressBar.get_hash_href()).toEqual({});
    });

    test("test set 1", () => {
        util_HashAddressBar.set_hash_href("k", "123");
        expect(util_HashAddressBar.get_hash_href()).toEqual({ k: "123" });
    });

    test("test set 2", () => {
        util_HashAddressBar.set_hash_href("name", "dimon");
        expect(util_HashAddressBar.get_hash_href()).toEqual({ k: "123", name: "dimon" });
    });

    test("test clear", () => {
        util_HashAddressBar.clear_hash_href();
        expect(util_HashAddressBar.get_hash_href()).toEqual({});
    });
});
