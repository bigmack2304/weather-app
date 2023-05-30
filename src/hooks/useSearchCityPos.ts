import React, { useState, useRef } from "react";
import { fetch_lat_lon } from "../utils/fetch_LatLon";
import type * as fetchLatLonTypes from "../utils/fetch_LatLon";

// Обращение к weather api для определения широты и долготы для города
// возвращает [ответ с сервера(обьект), функция для начала поиска города, функция для отчистки ответов с сервера]

function useSearchCityPos(
    errorCallback = () => {},
    fetchEndCallback = () => {},
    fetchStartCallback = () => {}
): [fetchResult: Readonly<fetchLatLonTypes.TFullResponse>, fetchRequest: (cityName: string) => void, deleteFetchResult: () => void] {
    let [fetchResult, setFetchResult] = useState<fetchLatLonTypes.TFullResponse>();
    let abortController = useRef<null | AbortController>(null);
    let isFetching = useRef<boolean>(false);

    const fetchingResponseCallback = (response: fetchLatLonTypes.TFullResponse) => {
        isFetching.current = false;
        abortController.current = null;
        setFetchResult(response);
        fetchEndCallback();
    };

    const fetchingErrorCallback = () => {
        isFetching.current = false;
        abortController.current = null;
        errorCallback();
    };

    const fetchingStartCallback = () => {
        if (isFetching.current && abortController.current != null) {
            abortController.current.abort();
            console.log("old fetch aborted");
            abortController.current = null;
        }
        isFetching.current = true;
        fetchStartCallback();
    };

    const getAbortController = (obj: AbortController) => {
        abortController.current = obj;
    };

    const fetchRequest = (cityName: string) => {
        fetchingStartCallback();
        fetch_lat_lon({
            cityName,
            limit: 5,
            callBack: fetchingResponseCallback,
            errorCallback: fetchingErrorCallback,
            getController: getAbortController,
        });
    };

    const clearFetchResult = () => {
        setFetchResult(undefined);
    };

    return [fetchResult, fetchRequest, clearFetchResult];
}

export { useSearchCityPos };
