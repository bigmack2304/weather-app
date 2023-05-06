import React from "react";
import { get_hash_href, set_hash_href, clear_hash_href } from "../utils/util_HashAddressBar";
import type { IHash } from "./../utils/util_HashAddressBar";

function useHashAddressBar(): [
    is_hashOnFirstLoad: Readonly<boolean>,
    set_hash: (key: string, value: string) => void,
    clear_hash: () => void,
    get_hash: () => IHash
] {
    function clear_hash() {
        clear_hash_href();
    }

    function set_hash(key: string, value: string) {
        set_hash_href(key, value);
    }

    function get_hash() {
        return get_hash_href();
    }

    // оно будет возвращать корректное значение только при первой загрузке страницы
    // даллее по логике хеш будет автоматически добавятся
    let is_hashOnFirstLoad = get_hash().city && get_hash().lat && get_hash().lon ? true : false;

    return [is_hashOnFirstLoad, set_hash, clear_hash, get_hash];
}

export { useHashAddressBar };
