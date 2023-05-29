import React, { useState, useRef } from "react";
import { fetch_5d3h_weather } from "../utils/fetch_5d3h_weather";
import type * as Types5d3hWeather from "../utils/fetch_5d3h_weather";

type TrefMemoPos = {
    prewLat: Tuse5d3hWeatherArgs["lat"];
    prewLon: Tuse5d3hWeatherArgs["lon"];
};

type Tuse5d3hWeatherArgs = {
    cityName?: string;
    lat?: number;
    lon?: number;
    errorCallback?: () => void;
    fetchStartCallback?: () => void;
    fetchEndCallback?: () => void;
};

const MAX_RADIUS = 0.05;

function use5d3hWeather({
    lat,
    lon,
    cityName,
    errorCallback = () => {},
    fetchEndCallback = () => {},
    fetchStartCallback = () => {},
}: Tuse5d3hWeatherArgs): [respWeather: Types5d3hWeather.TResponse, startFetch: () => void, forceFetch: () => void] {
    let [weather, setWeather] = useState<Types5d3hWeather.TResponse>();
    let memoPos = useRef<TrefMemoPos>({ prewLat: -999.999, prewLon: -999.999 }); // первоначально инициаизируем несуществующими координатами
    let isFetching = useRef<boolean>(false); // состояние Fetch, идетли сейчас запрос ?

    const fetchingResponseCallback = (resp: Types5d3hWeather.TResponse) => {
        isFetching.current = false;
        setWeather(resp);
        fetchEndCallback();
    };

    const fetchingErrorCallback = () => {
        isFetching.current = false;
        errorCallback();
    };

    const fetchingStartCallback = () => {
        isFetching.current = true;
        fetchStartCallback();
    };

    const isNewCoordsOutsRadiusOldCoords = () => {
        if (Math.abs(weather!.city.coord.lat - lat!) > MAX_RADIUS || Math.abs(weather!.city.coord.lon - lon!) > MAX_RADIUS) {
            return true;
        }
        return false;
    };

    const update_memoPos = () => {
        if (memoPos.current.prewLat !== lat) {
            memoPos.current.prewLat = lat;
        }
        if (memoPos.current.prewLon !== lon) {
            memoPos.current.prewLon = lat;
        }
    };

    const force_fetch = () => {
        if (lat && lon && !isFetching.current) {
            fetchingStartCallback();
            fetch_5d3h_weather({ lat, lon, callBack: fetchingResponseCallback, errorCallback: fetchingErrorCallback });
            return;
        }
    };

    const startFetch = () => {
        if (lat && lon && !isFetching.current) {
            if (memoPos.current.prewLat === lat || memoPos.current.prewLon === lon) return;

            update_memoPos();

            if (!weather) {
                fetchingStartCallback();
                fetch_5d3h_weather({ lat, lon, callBack: fetchingResponseCallback, errorCallback: fetchingErrorCallback });
            } else {
                // если новые координаты +- теже что и координаты текущего города то ничего не делаем
                // координаты от GEOAPI и из API запроса погоды могут немного отличватся
                // if (Math.abs(weather.coord.lat - lat) > MAX_RADIUS || Math.abs(weather.coord.lon - lon) > MAX_RADIUS) {
                if (isNewCoordsOutsRadiusOldCoords()) {
                    // дополнительно проверяем что искомый город отличается от текущего
                    if (weather.city.name !== cityName) {
                        fetchingStartCallback();
                        fetch_5d3h_weather({ lat, lon, callBack: fetchingResponseCallback, errorCallback: fetchingErrorCallback });
                    }
                }
            }
        }
    };

    return [weather, startFetch, force_fetch];
}

export { use5d3hWeather };
export type { Tuse5d3hWeatherArgs };
