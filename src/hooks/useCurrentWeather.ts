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

function useCurrentWeather({
    lat,
    lon,
    cityName,
    errorCallback = () => {},
    fetchEndCallback = () => {},
    fetchStartCallback = () => {},
}: TuseCurrentWeatherArgs): [currentWeather: TypesCurrentWeather.TResponse, startFetch: () => void] {
    let [weather, setWeather] = useState<TypesCurrentWeather.TResponse>();
    let memoPos = useRef<TrefMemoPos>({ prewLat: -999.999, prewLon: -999.999 }); // первоначально инициаизируем несуществующими координатами

    const responseCallback = (resp: TypesCurrentWeather.TResponse) => {
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

    //debugger;

    const deforeFetch = () => {
        if (lat && lon) {
            if (memoPos.current.prewLat === lat || memoPos.current.prewLon === lon) return;

            update_memoPos();

            if (!weather) {
                fetchStartCallback();
                fetch_current_weather({ lat, lon, callBack: responseCallback, errorCallback: fetchErrorCallback });
            } else {
                // если новые координаты +- теже что и координаты текущего города то ничего не делаем
                // координаты от GEOAPI и из API запроса погоды могут немного отличватся
                if (Math.abs(weather.coord.lat - lat) > MAX_RADIUS || Math.abs(weather.coord.lon - lon) > MAX_RADIUS) {
                    // дополнительно проверяем что искомый город отличается от текущего
                    if (weather.name !== cityName) {
                        fetchStartCallback();
                        fetch_current_weather({ lat, lon, callBack: responseCallback, errorCallback: fetchErrorCallback });
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

export { useCurrentWeather };
export type { TuseCurrentWeatherArgs };
