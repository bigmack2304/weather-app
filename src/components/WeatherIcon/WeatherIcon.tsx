import React from "react";
import "./WeatherIcon.scss";
import type { TResponse } from "../../utils/fetch_current_weather";
import { IconWeatherClearDay } from "../../ui/IconWeatherClearDay";
import { IconWeatherClearNight } from "../../ui/IconWeatherClearNight";
import { IconWeatherCloudyDay } from "../../ui/IconWeatherCloudyDay";
import { IconWeatherCloudyNight } from "../../ui/IconWeatherCloudyNight";
import { IconWeatherCloudy } from "../../ui/IconWeatherCloudy";
import { IconWeatherRain_1 } from "../../ui/IconWeatherRain_1";
import { IconWeatherRain_2 } from "../../ui/IconWeatherRain_2";
import { IconWeatherRain_3 } from "../../ui/IconWeatherRain_3";
import { IconWeatherThunder } from "../../ui/IconWeatherThunder";
import { IconWeatherSnowRain } from "../../ui/IconWeatherSnowRain";
import { IconWeatherSnow_1 } from "../../ui/IconWeatherSnow_1";
import { IconWeatherSnow_2 } from "../../ui/IconWeatherSnow_2";
import { IconWeatherSnow_3 } from "../../ui/IconWeatherSnow_3";
import { calc_weather_day_time, calc_sun_hours_details } from "../../utils/util_functions";

interface IWeatherIconProps {
    addClassName?: string[];
    weather: TResponse;
}

type TProps = Readonly<IWeatherIconProps>;

function renderIcon(weather: TResponse) {
    if (!weather) return;

    const day_time_datails = calc_sun_hours_details(weather.sys.sunrise, weather.sys.sunset, weather.timezone);
    const day_time = calc_weather_day_time(day_time_datails, weather);
    const weather_detail_id = weather.weather[0].id; // тут мы более детально можем определить погоднрые условия (подробние в типизации API)

    // чистое небо (днем или ночью)
    if (weather_detail_id === 800 || weather_detail_id === 801 || (weather_detail_id >= 701 && weather_detail_id <= 762)) {
        if (day_time == "NIGHT") {
            return <IconWeatherClearNight addClassName={["WeatherIcon__icon"]} />;
        }
        return <IconWeatherClearDay addClassName={["WeatherIcon__icon"]} />;
    }

    // облачность (днем или ночью)
    if ((weather_detail_id >= 771 && weather_detail_id <= 781) || weather_detail_id === 802 || weather_detail_id === 803) {
        if (day_time == "NIGHT") {
            return <IconWeatherCloudyNight addClassName={["WeatherIcon__icon"]} />;
        }
        return <IconWeatherCloudyDay addClassName={["WeatherIcon__icon"]} />;
    }

    // большая облачность
    if (weather_detail_id === 804) {
        return <IconWeatherCloudy addClassName={["WeatherIcon__icon"]} />;
    }

    // небольшой дождь
    if ((weather_detail_id >= 300 && weather_detail_id <= 321) || weather_detail_id === 500) {
        return <IconWeatherRain_1 addClassName={["WeatherIcon__icon"]} />;
    }
    // дождь
    if (weather_detail_id === 501 || weather_detail_id === 502 || weather_detail_id === 511 || weather_detail_id === 504) {
        return <IconWeatherRain_2 addClassName={["WeatherIcon__icon"]} />;
    }

    // большой дождь
    if (
        weather_detail_id === 503 ||
        weather_detail_id === 520 ||
        weather_detail_id === 521 ||
        weather_detail_id === 522 ||
        weather_detail_id === 531
    ) {
        return <IconWeatherRain_3 addClassName={["WeatherIcon__icon"]} />;
    }

    // большой дождь с грозой
    if (weather_detail_id >= 200 && weather_detail_id <= 232) {
        return <IconWeatherThunder addClassName={["WeatherIcon__icon"]} />;
    }

    // небольшой снег
    if (weather_detail_id === 600) {
        return <IconWeatherSnow_1 addClassName={["WeatherIcon__icon"]} />;
    }

    // снег
    if (weather_detail_id === 601 || weather_detail_id === 611) {
        return <IconWeatherSnow_2 addClassName={["WeatherIcon__icon"]} />;
    }

    // сильный снег
    if (weather_detail_id === 602) {
        return <IconWeatherSnow_3 addClassName={["WeatherIcon__icon"]} />;
    }

    // снег + дождь
    if (weather_detail_id >= 612 && weather_detail_id <= 622) {
        return <IconWeatherSnowRain addClassName={["WeatherIcon__icon"]} />;
    }

    console.warn(`Необработанный погодный ID:${weather_detail_id}`);
    return <IconWeatherCloudy addClassName={["WeatherIcon__icon"]} />;
}

function WeatherIcon({ addClassName = [""], weather }: TProps) {
    const componentClassName = [...addClassName, "WeatherIcon"].join(" ");
    return <div className={componentClassName}>{renderIcon(weather)}</div>;
}

export { WeatherIcon };
