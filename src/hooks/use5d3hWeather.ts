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
}: Tuse5d3hWeatherArgs): [respWeather: Types5d3hWeather.TResponse, startFetch: () => void] {
    let [weather, setWeather] = useState<Types5d3hWeather.TResponse>();
    let memoPos = useRef<TrefMemoPos>({ prewLat: -999.999, prewLon: -999.999 }); // первоначально инициаизируем несуществующими координатами

    const responseCallback = (resp: Types5d3hWeather.TResponse) => {
        setWeather(resp);
        fetchEndCallback();
    };

    const fetchErrorCallback = () => {
        errorCallback();
    };

    const update_memoPos = () => {
        if (memoPos.current.prewLat !== lat) {
            memoPos.current.prewLat = lat;
        }
        if (memoPos.current.prewLon !== lon) {
            memoPos.current.prewLon = lat;
        }
    };

    const deforeFetch = () => {
        if (lat && lon) {
            if (memoPos.current.prewLat === lat || memoPos.current.prewLon === lon) return;

            update_memoPos();

            if (!weather) {
                fetchStartCallback();
                fetch_5d3h_weather({ lat, lon, callBack: responseCallback, errorCallback: fetchErrorCallback });
            } else {
                // если новые координаты +- теже что и координаты текущего города то ничего не делаем
                // координаты от GEOAPI и из API запроса погоды могут немного отличватся
                // if (Math.abs(weather.coord.lat - lat) > MAX_RADIUS || Math.abs(weather.coord.lon - lon) > MAX_RADIUS) {
                if (Math.abs(weather.city.coord.lat - lat) > MAX_RADIUS || Math.abs(weather.city.coord.lon - lon) > MAX_RADIUS) {
                    // дополнительно проверяем что искомый город отличается от текущего
                    if (weather.city.name !== cityName) {
                        fetchStartCallback();
                        fetch_5d3h_weather({ lat, lon, callBack: responseCallback, errorCallback: fetchErrorCallback });
                    }
                }
            }
        }
    };

    const startFetch = () => {
        deforeFetch();
    };

    return [weather, startFetch];
}

export { use5d3hWeather };
export type { Tuse5d3hWeatherArgs };
