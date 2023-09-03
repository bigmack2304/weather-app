import React, { useEffect } from "react";
import { useHandleUpdate } from "./useHandleUpdate";
import { set_storage_data, get_stprage_data } from "./../appLocalStorage/appLoacalStorage";
import type { IAppLocalStorage } from "./../appLocalStorage/appLoacalStorage";

// хук для чтения и записи данных в локал-сторадж, по томуже принцыпу что и useState
// updateOnChange - разрешить-ли обновление компонента при изменении данных в локал-сторадже

// В теории изменение стораджа в одном компоненте приведет и к обновлению других компонентов
// которые используют этот хук с параметром true

function useLoacalStorage(
    updateOnChange: boolean
): [localStorageData: IAppLocalStorage, setLocalStorageData: (data: IAppLocalStorage) => void] {
    const localData = get_stprage_data();
    const [handleupdate] = useHandleUpdate();

    const setLocalData = (data: IAppLocalStorage) => {
        set_storage_data(data);
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
