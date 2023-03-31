import React, { createContext } from "react";

type TWeatherContext = {
    selectCityCallback: (lat: number, lon: number, cityName: string) => void;
    lat?: number;
    lon?: number;
    cityName?: string;
};

const baseWeatherContext: TWeatherContext = {
    selectCityCallback: (lat: number, lon: number, cityName: string) => {},
    lat: undefined,
    lon: undefined,
    cityName: undefined,
};

const WeatherContext = createContext(baseWeatherContext);
WeatherContext.displayName = "Weather_Context";

export { WeatherContext, baseWeatherContext };
export type { TWeatherContext };
