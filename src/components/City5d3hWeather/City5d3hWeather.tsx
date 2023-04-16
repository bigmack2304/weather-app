import React, { useContext, useEffect, useState } from "react";
import "./City5d3hWeather.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { use5d3hWeather } from "../../hooks/use5d3hWeather";
import { IconLoader } from "../../ui/IconLoader";

interface ICity5d3hWeatherProps {}

type TProps = Readonly<ICity5d3hWeatherProps>;

function City5d3hWeather({}: TProps = {}) {
    const { lat, lon, cityName } = useContext(WeatherContext);
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false);

    const onErrorFetchWeather = () => {
        setIsLoadingVisible(false);
    };

    const onStartFetchWeather = () => {
        setIsLoadingVisible(true);
    };

    const onEndFetchWeather = () => {
        setIsLoadingVisible(false);
    };

    let [Weather, getWeather] = use5d3hWeather({
        cityName,
        lat,
        lon,
        errorCallback: onErrorFetchWeather,
        fetchStartCallback: onStartFetchWeather,
        fetchEndCallback: onEndFetchWeather,
    });

    useEffect(() => {
        if (Weather) {
            console.log(Weather);
        }
    }, [Weather]);

    useEffect(() => {
        getWeather();
    });

    return (
        <div className="City5d3hWeather">
            {Weather ? null : !isLoadingVisible ? (
                <>
                    <div className="City5d3hWeather__default"></div>
                </>
            ) : null}
            {isLoadingVisible ? (
                <div className="City5d3hWeather__loader_wrapper">
                    <IconLoader addClassName={["City5d3hWeather__loader"]} />
                </div>
            ) : null}
        </div>
    );
}

export { City5d3hWeather };
export type { ICity5d3hWeatherProps };
