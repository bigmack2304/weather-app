import React, { createContext } from "react";

// контекст погоды, необходим для проброса нужных данных компонентам которые сделают запрос на сервер и получат ответ с данными о погоде.
// обновляется после получения координат запрашиваемого города. из CityPosSearch
// на данный момент, функция определяющая изменение контекста есть только в компоненте Home

type TWeatherContext = {
    selectCityCallback: (lat: number, lon: number, cityName: string) => void;
    lat?: number;
    lon?: number;
    cityName?: string;
    pageRef?: React.RefObject<HTMLElement>;
};

const baseWeatherContext: TWeatherContext = {
    selectCityCallback: (lat: number, lon: number, cityName: string) => {},
    lat: undefined,
    lon: undefined,
    cityName: undefined,
    pageRef: undefined,
};

const WeatherContext = createContext(baseWeatherContext);
WeatherContext.displayName = "Weather_Context";

export { WeatherContext, baseWeatherContext };
export type { TWeatherContext };
