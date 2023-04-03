import React, { useContext, useEffect } from "react";
import "./CityCurrentWeather.scss";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";
import { WeatherContext } from "../../Contexts/WeatherContext";

interface ICityCurrentWeatherProps {}

type TProps = Readonly<ICityCurrentWeatherProps>;

function deg_to_compass(val: number) {
    // 0 45 90 135 180 225 270 315
    const STEP = 22.5;

    if (val > 0 - STEP && val < 0 + STEP) {
        return "северное";
    }

    if (val > 45 - STEP && val < 45 + STEP) {
        return "северно-восточное";
    }

    if (val > 90 - STEP && val < 90 + STEP) {
        return "восточное";
    }

    if (val > 135 - STEP && val < 135 + STEP) {
        return "южно-восточное";
    }

    if (val > 180 - STEP && val < 180 + STEP) {
        return "южное";
    }

    if (val > 225 - STEP && val < 225 + STEP) {
        return "южно-западное";
    }

    if (val > 270 - STEP && val < 270 + STEP) {
        return "западное";
    }

    if (val > 315 - STEP && val < 315 + STEP) {
        return "северно-западное";
    }
}

function CityCurrentWeather({}: TProps = {}) {
    const onErrorCurrentWeather = () => {};
    const { lat, lon, cityName } = useContext(WeatherContext);

    let [currentWeather] = useCurrentWeather({ cityName, lat, lon, errorCallback: onErrorCurrentWeather });

    useEffect(() => {
        if (currentWeather) {
            console.log(currentWeather);
        }
    }, [currentWeather]);

    return (
        <div className="CityCurrentWeather">
            {currentWeather ? (
                <>
                    <h2 className="CityCurrentWeather__head">{`${currentWeather.name}: ${currentWeather.weather[0].description}`}</h2>
                    <section className="CityCurrentWeather__wrapper">
                        <h4 className="visually_hidden">Детали</h4>
                        <span>Температура: {`${Math.round(currentWeather.main.temp)}`}°</span>
                        <span>Ощущается как: {`${Math.round(currentWeather.main.feels_like)}`}°</span>
                        <span>Влажность: {`${Math.round(currentWeather.main.humidity)}`}%</span>
                        <span>Видимость: {`${currentWeather.visibility / 1000}`} Km</span>
                        <span>Скорость ветра: {`${currentWeather.wind.speed}`} m/сек</span>
                        <span>Порывы ветра: до {`${currentWeather.wind.gust}`} m/сек</span>
                        <span>Направление ветра: {deg_to_compass(currentWeather.wind.deg)}</span>
                    </section>
                </>
            ) : null}
        </div>
    );
}

export { CityCurrentWeather };
export type { ICityCurrentWeatherProps };
