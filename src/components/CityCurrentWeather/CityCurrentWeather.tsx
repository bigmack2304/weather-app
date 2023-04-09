import React, { useContext, useEffect, useState } from "react";
import "./CityCurrentWeather.scss";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { IconDirection } from "../../ui/IconDirection";
import { calc_backgraund_type, calc_sun_hours_details } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import { WeatherNowTime } from "../WeatherNowTime/WeatherNowTime";
import { WeatherBaseInfo } from "../WeatherBaseInfo/WeatherBaseInfo";
import { WeatherAltInfoFall } from "../WeatherAltInfoFall/WeatherAltInfoFall";
import { WeatherAltInfoWnd } from "../WeatherAltInfoWnd/WeatherAltInfoWnd";
import "./../../fonts/acline/acline.css";

interface ICityCurrentWeatherProps {}

type TProps = Readonly<ICityCurrentWeatherProps>;

// сила ветра
// 0 – штиль (безветрие);
// 1 – 3 – слабый (скорость 2 – 5 м/с);
// 4 – 5 – умеренный (5 – 10 м/с);
// 6 – 8 – сильный (10 – 18 м/с);
// 9 – 11 – шторм (18 – 30 м/с);
// 12 – ураган (более 30 м/с);

function CityCurrentWeather({}: TProps = {}) {
    const { lat, lon, cityName, pageRef } = useContext(WeatherContext);
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false);

    const onErrorCurrentWeather = () => {
        setIsLoadingVisible(false);
    };

    const onStartCurrentWeather = () => {
        setIsLoadingVisible(true);
    };

    const onEndCurrentWeather = () => {
        setIsLoadingVisible(false);
    };

    let [currentWeather, getWeather] = useCurrentWeather({
        cityName,
        lat,
        lon,
        errorCallback: onErrorCurrentWeather,
        fetchStartCallback: onStartCurrentWeather,
        fetchEndCallback: onEndCurrentWeather,
    });

    useEffect(() => {
        if (currentWeather) {
            console.log(currentWeather);

            let sun_data = calc_sun_hours_details(currentWeather.sys.sunrise, currentWeather.sys.sunset, currentWeather.timezone);

            if (pageRef && pageRef.current) {
                for (let elem of Array.from(pageRef.current.classList)) {
                    if (elem.startsWith("Home--bg_")) {
                        pageRef.current.classList.remove(elem);
                    }
                }

                pageRef.current.classList.add(`Home--bg_${calc_backgraund_type(sun_data, currentWeather)}`);
            }
        }
    }, [currentWeather]);

    useEffect(() => {
        getWeather();
    });

    // return (
    //     <div className="CityCurrentWeather">
    //         {currentWeather ? (
    //             <>
    /////                 <h2 className="CityCurrentWeather__head">{`${currentWeather.name}: ${currentWeather.weather[0].description}`}</h2>
    //                 <section className="CityCurrentWeather__wrapper">
    //                     <h4 className="visually_hidden">Детали</h4>
    ////                     <span>Температура: {`${Math.round(currentWeather.main.temp)}`}°</span>
    ////                     <span>Ощущается как: {`${Math.round(currentWeather.main.feels_like)}`}°</span>
    //                     <span>Влажность: {`${Math.round(currentWeather.main.humidity)}`}%</span>
    //                     <span>Видимость: {`${currentWeather.visibility / 1000}`} Km</span>
    //                     {currentWeather.wind ? (
    //                         <>
    //                             <span>Скорость ветра: {`${currentWeather.wind.speed}`} m/сек</span>
    //                             <span>Порывы ветра: до {`${currentWeather.wind.gust}`} m/сек</span>

    //                             <span style={{ verticalAlign: "middle" }}>
    //                                 Направление ветра: {deg_to_compass(currentWeather.wind.deg)}{" "}
    //                                 <IconDirection
    //                                     direction={deg_invesion(currentWeather.wind.deg)}
    //                                     addClassName={["CityCurrentWeather__wind_direction"]}
    //                                     title={deg_to_compass(currentWeather.wind.deg)}
    //                                 />
    //                             </span>
    //                         </>
    //                     ) : null}
    //                     {currentWeather.snow ? (
    //                         <>
    //                             <span>Снег: {`${currentWeather.snow["1h"]}mm`} за час.</span>
    //                         </>
    //                     ) : null}
    //                     {currentWeather.rain ? (
    //                         <>
    //                             <span>Дождь: {`${currentWeather.rain["1h"]}mm`} за час.</span>
    //                         </>
    //                     ) : null}
    //                 </section>
    //             </>
    //         ) : null}
    //     </div>
    // );

    return (
        <div className="CityCurrentWeather">
            {currentWeather ? (
                <>
                    <div className="CityCurrentWeather__head">
                        <h2 className="CityCurrentWeather__name">{currentWeather.name}</h2>
                        <WeatherNowTime weather={currentWeather} addClassName={["CityCurrentWeather__data_details"]} />
                        <WeatherBaseInfo weather={currentWeather} />

                        <div className="CityCurrentWeather__alt_info">
                            <WeatherAltInfoFall weather={currentWeather} />
                            <WeatherAltInfoWnd weather={currentWeather} />
                        </div>
                    </div>
                </>
            ) : !isLoadingVisible ? (
                <>
                    <div className="CityCurrentWeather__default">
                        <p className="CityCurrentWeather__default_text">Начните поиск.</p>
                    </div>
                </>
            ) : null}

            {isLoadingVisible ? (
                <div className="CityCurrentWeather__loader_wrapper">
                    <IconLoader addClassName={["CityCurrentWeather__loader"]} />
                </div>
            ) : null}
        </div>
    );
}

export { CityCurrentWeather };
export type { ICityCurrentWeatherProps };
