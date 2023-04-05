import React, { useContext, useEffect } from "react";
import "./City5d3hWeather.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { use5d3hWeather } from "../../hooks/use5d3hWeather";

interface ICity5d3hWeatherProps {}

type TProps = Readonly<ICity5d3hWeatherProps>;

function City5d3hWeather({}: TProps = {}) {
    const onErrorWeather = () => {};
    const { lat, lon, cityName } = useContext(WeatherContext);

    let [Weather, getWeather] = use5d3hWeather({ cityName, lat, lon, errorCallback: onErrorWeather });

    useEffect(() => {
        if (Weather) {
            console.log(Weather);
        }
    }, [Weather]);

    useEffect(() => {
        getWeather();
    });

    return <div className="City5d3hWeather"></div>;
}

export { City5d3hWeather };
export type { ICity5d3hWeatherProps };
