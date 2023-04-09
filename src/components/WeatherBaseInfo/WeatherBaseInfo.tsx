import React from "react";
import "./WeatherBaseInfo.scss";

import type { TResponse } from "../../utils/fetch_current_weather";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";

// базовая инфа, значок погоды + короткое описание + температура + как ощущается

interface IWeatherBaseInfoProps {
    addClassName?: string[];
    weather: TResponse;
}

type TProps = Readonly<IWeatherBaseInfoProps>;

function WeatherBaseInfo({ addClassName = [""], weather }: TProps) {
    const componentClassName = [...addClassName, "WeatherBaseInfo"].join(" ");
    return (
        <>
            {weather ? (
                <div className={componentClassName}>
                    <p className="WeatherBaseInfo__desc">{weather.weather[0].description}</p>
                    <WeatherIcon weather={weather} />
                    <div className="WeatherBaseInfo__temp_wrapper">
                        <span className="WeatherBaseInfo__temp">{`${weather.main.temp.toFixed(1)}`}°c</span>
                        <span className="WeatherBaseInfo__temp_feels_like">{`Ощущается как: ${weather.main.feels_like.toFixed(1)}`}°c</span>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export { WeatherBaseInfo };
