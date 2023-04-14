interface IHash {
    city?: string;
    lat?: string;
    lon?: string;
}

function get_href() {
    return window.location.href;
}

function get_hash_href(): IHash {
    let this_url = new URL(get_href());
    let hash = this_url.hash;

    if (hash == "") {
        hash = "{}";
    }

    hash = decodeURIComponent(hash); // тут хеш закодирован, декодируем
    if (hash.startsWith("#")) {
        hash = hash.slice(1); // убераем ненужный символ в начале
    }
    return JSON.parse(hash);
}

function set_hash_href(key: string, value: string) {
    let old_hash = get_hash_href();
    let new_hash = { ...old_hash, [`${key}`]: value };

    window.location.hash = JSON.stringify(new_hash);
}

function clear_hash_href() {
    window.location.hash = JSON.stringify({});
}

export { get_hash_href, set_hash_href, clear_hash_href };
export type { IHash };
