import React, { useState } from "react";
import { fetch_lat_lon } from "../utils/fetch_LatLon";
import type * as fetchLatLonTypes from "../utils/fetch_LatLon";

// Обращение к weather api для определения широты и долготы для города
// возвращает [ответ с сервера(обьект), функция для начала поиска города, функция для отчистки ответов с сервера]

function useSearchCityPos(
    onFetchError: () => void = () => {}
): [Readonly<fetchLatLonTypes.TFullResponse>, (cityName: string) => void, () => void] {
    let [fetchResult, setFetchResult] = useState<fetchLatLonTypes.TFullResponse>();

    const fetchCallback = (response: fetchLatLonTypes.TFullResponse) => {
        setFetchResult(response);
    };

    const fetchRequest = (cityName: string) => {
        fetch_lat_lon({ cityName, limit: 5, callBack: fetchCallback, errorCallback: onFetchError });
    };

    const clearFetchResult = () => {
        setFetchResult(undefined);
    };

    return [fetchResult, fetchRequest, clearFetchResult];
}

export { useSearchCityPos };
