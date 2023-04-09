import React from "react";
import "./WeatherNowTime.scss";
import type { TResponse } from "../../utils/fetch_current_weather";
import { get_text_date } from "../../utils/util_functions";

interface IWeatherNowTimeProps {
    addClassName?: string[];
    weather: TResponse;
}

type TProps = Readonly<IWeatherNowTimeProps>;

function WeatherNowTime({ addClassName = [""], weather }: TProps) {
    const componentClassName = [...addClassName, "WeatherNowTime"].join(" ");
    let obj_date: ReturnType<typeof get_text_date> | undefined;

    if (weather) {
        let weather_date = new Date((weather.dt + weather.timezone) * 1000); // сервер возвращает таймштамп в секундах а также необходимое смещение для нашего города
        weather_date.setHours(weather_date.getUTCHours()); // Date возвращает дату со сдвигом, нам это не нужно поэтому выставим ее в UTC0
        obj_date = get_text_date(weather_date);
    }

    return (
        <div className={componentClassName}>
            {weather && obj_date ? (
                <>
                    <p className="WeatherNowTime__data_details">{`${obj_date.dayNum_monthName} ${obj_date.year_num} ${obj_date.hours}:${obj_date.minutes}`}</p>
                </>
            ) : null}
        </div>
    );
}

export { WeatherNowTime };
