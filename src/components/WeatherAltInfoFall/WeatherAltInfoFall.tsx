import React from "react";
import "./WeatherAltInfoFall.scss";

import type { TResponse, TresponseObj } from "../../utils/fetch_current_weather";

// будем показывать количество осадков если они есть.

interface IWeatherAltInfoFallProps {
    addClassName?: string[];
    weather: TResponse;
}

type TProps = Readonly<IWeatherAltInfoFallProps>;

function fall_type(weather: TresponseObj) {
    if (weather.rain) {
        return "Дождь";
    }
    if (weather.snow) {
        return "Снег";
    }
}

function fall_value(weather: TresponseObj) {
    if (weather.rain) {
        return weather.rain["1h"];
    }
    if (weather.snow) {
        return weather.snow["1h"];
    }
}

function WeatherAltInfoFall({ addClassName = [""], weather }: TProps) {
    const componentClassName = [...addClassName, "WeatherAltInfoFall"].join(" ");
    const is_fall = weather?.rain || weather?.snow ? true : false;

    return (
        <>
            {weather && is_fall ? (
                <div className={componentClassName}>
                    <p className="WeatherAltInfoFall__desc">{fall_type(weather)}</p>
                    <div className="WeatherAltInfoFall__fall_wrapper">
                        <span className="WeatherAltInfoFall__value_type">{fall_value(weather)}</span>
                        <span className="WeatherAltInfoFall__value">mm/ч</span>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export { WeatherAltInfoFall };
