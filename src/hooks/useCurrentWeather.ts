import React, { useState, useRef } from "react";
import { fetch_current_weather } from "../utils/fetch_current_weather";
import type * as TypesCurrentWeather from "../utils/fetch_current_weather";
// import { useLoacalStorage } from "./useLocalStorage";

type TuseCurrentWeatherArgs = {
    cityName?: string;
    lat?: number;
    lon?: number;
    errorCallback?: () => void;
};

const MAX_RADIUS = 0.05;

function useCurrentWeather({
    lat,
    lon,
    cityName,
    errorCallback = () => {},
}: TuseCurrentWeatherArgs): [currentWeather: TypesCurrentWeather.TResponse] {
    let [weather, setWeather] = useState<TypesCurrentWeather.TResponse>();
    let memoPos = useRef({ prewLat: lat, prewLon: lon });
    // let [localStorageData, setLocalStorageData] = useLoacalStorage(false);

    const responseCallback = (resp: TypesCurrentWeather.TResponse) => {
        setWeather(resp);

        // при получении погоды о городе, заносим его в историю
        // if (resp) {
        //     let new_data = { name: resp.name, lat: resp.coord.lat, lon: resp.coord.lon };
        //     setLocalStorageData({ ...localStorageData, history: [new_data, ...localStorageData.history] });
        // }
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

    // debugger;

    const deforeFetch = () => {
        if (lat && lon) {
            if (memoPos.current.prewLat === lat || memoPos.current.prewLon === lon) return;

            update_memoPos();

            if (!weather) {
                fetch_current_weather({ lat, lon, callBack: responseCallback, errorCallback: fetchErrorCallback });
            } else {
                // если новые координаты +- теже что и координаты текущего города то ничего не делаем
                // координаты от GEOAPI и из API запроса погоды могут немного отличватся
                if (Math.abs(weather.coord.lat - lat) > MAX_RADIUS || Math.abs(weather.coord.lon - lon) > MAX_RADIUS) {
                    // дополнительно проверяем что искомый город отличается от текущего
                    if (weather.name !== cityName) {
                        fetch_current_weather({ lat, lon, callBack: responseCallback, errorCallback: fetchErrorCallback });
                    }
                }
            }
        }
    };

    deforeFetch();

    return [weather];
}

export { useCurrentWeather };
export type { TuseCurrentWeatherArgs };
