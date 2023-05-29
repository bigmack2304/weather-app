import React, { useState, useRef } from "react";
import { fetch_current_weather } from "../utils/fetch_current_weather";
import type * as TypesCurrentWeather from "../utils/fetch_current_weather";

type TrefMemoPos = {
    prewLat: TuseCurrentWeatherArgs["lat"];
    prewLon: TuseCurrentWeatherArgs["lon"];
};

type TuseCurrentWeatherArgs = {
    cityName?: string;
    lat?: number;
    lon?: number;
    errorCallback?: () => void;
    fetchStartCallback?: () => void;
    fetchEndCallback?: () => void;
};

const MAX_RADIUS = 0.05;

// возвращает [данные о погоде, startFetch для старта запроса, forceFetch для принудительного запроса]
// startFetch - делает запрос, но с проверками и ограничениями, чтобы нельзя было получать данные для города для которого мы уже получили данные, также др. проверки
// forceFetch - тоже делает запрос но тут ограничений почти нет, в 99% случаев запрос будет сделан

function useCurrentWeather({
    lat,
    lon,
    cityName,
    errorCallback = () => {},
    fetchEndCallback = () => {},
    fetchStartCallback = () => {},
}: TuseCurrentWeatherArgs): [currentWeather: TypesCurrentWeather.TResponse, startFetch: () => void, forceFetch: () => void] {
    let [weather, setWeather] = useState<TypesCurrentWeather.TResponse>();
    let memoPos = useRef<TrefMemoPos>({ prewLat: -999.999, prewLon: -999.999 }); // первоначально инициаизируем несуществующими координатами
    let isFetching = useRef<boolean>(false); // состояние Fetch, идетли сейчас запрос ?
    let abortController = useRef<null | AbortController>(null);

    const fetchingResponseCallback = (resp: TypesCurrentWeather.TResponse) => {
        isFetching.current = false;
        abortController.current = null;
        setWeather(resp);
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

    const update_memoPos = () => {
        if (memoPos.current.prewLat !== lat) {
            memoPos.current.prewLat = lat;
        }
        if (memoPos.current.prewLon !== lon) {
            memoPos.current.prewLon = lat;
        }
    };

    const isNewCoordsOutsRadiusOldCoords = () => {
        if (Math.abs(weather!.coord.lat - lat!) > MAX_RADIUS || Math.abs(weather!.coord.lon - lon!) > MAX_RADIUS) {
            return true;
        }
        return false;
    };

    const force_fetch = () => {
        if (lat && lon) {
            fetchingStartCallback();
            fetch_current_weather({
                lat,
                lon,
                callBack: fetchingResponseCallback,
                errorCallback: fetchingErrorCallback,
                getController: getAbortController,
            });
            return;
        }
    };

    const startFetch = () => {
        // if (lat && lon && !isFetching.current) {
        if (lat && lon) {
            if (memoPos.current.prewLat === lat || memoPos.current.prewLon === lon) return;

            update_memoPos();

            if (!weather) {
                fetchingStartCallback();
                fetch_current_weather({
                    lat,
                    lon,
                    callBack: fetchingResponseCallback,
                    errorCallback: fetchingErrorCallback,
                    getController: getAbortController,
                });
            } else {
                // если новые координаты +- теже что и координаты текущего города то ничего не делаем
                // координаты от GEOAPI и из API запроса погоды могут немного отличватся
                if (isNewCoordsOutsRadiusOldCoords()) {
                    // дополнительно проверяем что искомый город отличается от текущего
                    if (weather.name !== cityName) {
                        fetchingStartCallback();
                        fetch_current_weather({
                            lat,
                            lon,
                            callBack: fetchingResponseCallback,
                            errorCallback: fetchingErrorCallback,
                            getController: getAbortController,
                        });
                    }
                }
            }
        }
    };

    return [weather, startFetch, force_fetch];
}

export { useCurrentWeather };
export type { TuseCurrentWeatherArgs };
