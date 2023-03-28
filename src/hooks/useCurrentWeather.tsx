import React, { useState } from "react";
import { fetch_lat_lon } from "../utils/fetch_LatLon";
import { fetch_current_weather } from "../utils/fetch_current_weather";
import type * as TypesCurrentWeather from "../utils/fetch_current_weather";
import type * as TypesPosCity from "../utils/fetch_LatLon";

// запрос текущей погоды
// TODO строка 15 pos[0] , 0 это первый найденный город, их может быть до пяти, если их более одного то
// юзеро должен сам выбрать город из найденных

function useCurrentWeather(): [TypesCurrentWeather.TResponse, (cityName: string) => void] {
    let [weather, setWeather] = useState<TypesCurrentWeather.TResponse>();

    const positionCallback = (pos: TypesPosCity.TFullResponse) => {
        if (!pos || (pos && !pos[0])) return;
        let { lat, lon } = pos[0];
        fetch_current_weather({ lat: lat, lon: lon, callBack: responseCallback });
    };

    const responseCallback = (resp: TypesCurrentWeather.TResponse) => {
        setWeather(resp);
    };

    const fetchCurrentWeather = (cityName: string) => {
        fetch_lat_lon({ cityName: cityName, callBack: positionCallback, limit: 5 });
    };

    return [weather, fetchCurrentWeather];
}

export { useCurrentWeather };
