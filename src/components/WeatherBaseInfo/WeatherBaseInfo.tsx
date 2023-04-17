import React from "react";
import "./WeatherBaseInfo.scss";

import type { TresponseObjWeatherObj } from "../../utils/fetch_current_weather";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";

// базовая инфа, значок погоды + короткое описание + температура + как ощущается

interface IWeatherBaseInfoProps {
    addClassName?: string[];
    weather_data: {
        sunrise: number;
        sunset: number;
        timezone: number;
        dt: number;
        weather_id: TresponseObjWeatherObj["id"];
        temp: number;
        feels_like: number;
        description: string;
    };
}

type TProps = Readonly<IWeatherBaseInfoProps>;

function WeatherBaseInfo({ addClassName = [""], weather_data }: TProps) {
    const componentClassName = [...addClassName, "WeatherBaseInfo"].join(" ");
    return (
        <div className={componentClassName}>
            <p className="WeatherBaseInfo__desc">{weather_data.description}</p>
            <WeatherIcon
                weather_data={{
                    sunrise: weather_data.sunrise,
                    sunset: weather_data.sunset,
                    timezone: weather_data.timezone,
                    dt: weather_data.dt,
                    weather_id: weather_data.weather_id,
                }}
            />
            <div className="WeatherBaseInfo__temp_wrapper">
                <span className="WeatherBaseInfo__temp">{`${weather_data.temp.toFixed(1)}`}°c</span>
                <span className="WeatherBaseInfo__temp_feels_like">{`Ощущается как: ${weather_data.feels_like.toFixed(1)}`}°c</span>
            </div>
        </div>
    );
}

export { WeatherBaseInfo };
