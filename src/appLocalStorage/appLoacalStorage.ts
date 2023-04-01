// определение локал-стораджа всего приложения

type TStorageHistoryCity = { name: string; lat: number; lon: number };

// тип локал стораджа приложения
interface IAppLocalStorage {
    history: TStorageHistoryCity[]; // история искомых городов
}

const STORAGE_KEY = "app_local_data";

const STORAGE_DEF_VALUE: IAppLocalStorage = {
    history: [],
};

function get_stprage_data() {
    const read_data = localStorage.getItem(STORAGE_KEY);

    if (read_data !== null) {
        return JSON.parse(read_data) as IAppLocalStorage;
    }

    return STORAGE_DEF_VALUE;
}

function set_storage_data(data: IAppLocalStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// TODO возможно это когдато понадобится (событие обновления стораджа)
function dispatchEventStorageUpdate() {
    window.dispatchEvent(new CustomEvent("appLocalStorageUpdate"));
}

export { STORAGE_KEY, STORAGE_DEF_VALUE, get_stprage_data, set_storage_data, dispatchEventStorageUpdate };
export type { TStorageHistoryCity, IAppLocalStorage };
