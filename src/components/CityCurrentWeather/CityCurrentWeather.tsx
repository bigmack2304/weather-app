import React, { useContext, useEffect } from "react";
import "./CityCurrentWeather.scss";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";
import { WeatherContext } from "../../Contexts/WeatherContext";

interface ICityCurrentWeatherProps {}

type TProps = Readonly<ICityCurrentWeatherProps>;

function CityCurrentWeather({}: TProps = {}) {
    const onErrorCurrentWeather = () => {};
    const { lat, lon, cityName } = useContext(WeatherContext);

    let [currentWeather] = useCurrentWeather({ cityName, lat, lon, errorCallback: onErrorCurrentWeather });

    useEffect(() => {
        if (currentWeather) {
            console.log(currentWeather);
        }
    }, [currentWeather]);

    return <div className="CityCurrentWeather"></div>;
}

export { CityCurrentWeather };
export type { ICityCurrentWeatherProps };
