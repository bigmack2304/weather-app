import React, { useEffect } from "react";
import { useHandleUpdate } from "./useHandleUpdate";

// хук для чтения и записи данных в локал-сторадж, по томуже принцыпу что и useState
// updateOnChange - разрешить-ли обновление компонента при изменении данных в локал-сторадже

// В теории изменение стораджа в одном компоненте приведет и к обновлению других компонентов
// которые используют этот хук с параметром true

const STORAGE_KEY = "app_local_data";
const STORAGE_DEF_VALUE = [];

function useLoacalStorage(updateOnChange: boolean): [localStorageData: object, setLocalStorageData: (data: object) => void] {
    const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as object;
    const [handleupdate] = useHandleUpdate();

    const setLocalData = (data: object) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent("appLocalStorageUpdate"));
    };

    useEffect(() => {
        if (updateOnChange) {
            window.addEventListener("appLocalStorageUpdate", handleupdate);
        }
        return () => {
            if (updateOnChange) {
                window.removeEventListener("appLocalStorageUpdate", handleupdate);
            }
        };
    }, []);

    return [localData, setLocalData];
}

export { useLoacalStorage };
