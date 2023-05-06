import React from "react";
import "./WeatherNowTime.scss";
import { get_text_date } from "../../utils/util_functions";

// возвращает элемент с текстом времяни, закодированным в погоду

interface IWeatherNowTimeProps {
    addClassName?: string[];
    get_dayNum_monthName?: boolean;
    get_year?: boolean;
    get_hours?: boolean;
    get_minutes?: boolean;
    get_hours_minutes?: boolean;
    times: { dt: number; timezone: number };
}

type TProps = Readonly<IWeatherNowTimeProps>;

function WeatherNowTime({
    addClassName = [""],
    times,
    get_dayNum_monthName = true,
    get_year = true,
    get_hours = true,
    get_minutes = true,
    get_hours_minutes = true,
}: TProps) {
    const componentClassName = [...addClassName, "WeatherNowTime"].join(" ");
    let obj_date: ReturnType<typeof get_text_date>;

    let weather_date = new Date((times.dt + times.timezone) * 1000); // сервер возвращает таймштамп в секундах а также необходимое смещение для нашего города
    obj_date = get_text_date(weather_date);

    const RenderString = () => {
        let str = "";

        if (get_dayNum_monthName) {
            str += ` ${obj_date.dayNum_monthNameUTC}`;
        }

        if (get_year) {
            str += ` ${obj_date.year_numUTC}`;
        }

        if (get_hours) {
            str += ` ${obj_date.hoursUTC}`;
        }

        if (get_minutes) {
            str += ` ${obj_date.minutesUTC}`;
        }

        if (get_hours_minutes) {
            str += ` ${obj_date.hoursUTC}:${obj_date.minutesUTC}`;
        }

        return str.trim();
    };

    return (
        <div className={componentClassName}>
            <p className="WeatherNowTime__data_details">{RenderString()}</p>
        </div>
    );
}

export { WeatherNowTime };
