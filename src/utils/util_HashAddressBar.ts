// типизация хэша страницы
interface IHash {
    city?: string;
    lat?: string;
    lon?: string;
}

// позвращает текущий адрес страницы
function get_href() {
    return window.location.href;
}

// возвращает хеш страницы в виде обьекта
function get_hash_href(): IHash {
    let this_url = new URL(get_href());
    let hash: string; // тут хеш закодирован, декодируем
    let result: object;

    try {
        hash = decodeURIComponent(this_url.hash);
    } catch {
        hash = "";
    }

    if (hash == "") {
        hash = "{}";
    }

    if (hash.startsWith("#")) {
        hash = hash.slice(1); // убераем ненужный символ в начале
    }

    try {
        result = JSON.parse(hash);
    } catch {
        result = {};
    }

    return result;
}

// устанавливает своиство + значение в хеш страницы
function set_hash_href(key: string, value: string) {
    let old_hash = get_hash_href();
    let new_hash = { ...old_hash, [`${key}`]: value };
    window.location.hash = encodeURIComponent(JSON.stringify(new_hash));
}

// полностью отчищает хеш страницы
function clear_hash_href() {
    window.location.hash = encodeURIComponent("{}");
}

export { get_hash_href, set_hash_href, clear_hash_href };
export type { IHash };
