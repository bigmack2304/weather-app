import React, { useContext, useEffect, useState } from "react";
import "./CityCurrentWeather.scss";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { IconDirection } from "../../ui/IconDirection";
import { calc_backgraund_type, calc_sun_hours_details } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import { WeatherNowTime } from "../WeatherNowTime/WeatherNowTime";
import { WeatherBaseInfo } from "../WeatherBaseInfo/WeatherBaseInfo";
import { WeatherAltInfoTemplate } from "../WeatherAltInfoTemplate/WeatherAltInfoTemplate";
import "./../../fonts/acline/acline.css";

import { WeatherSunPhase } from "../WeatherSunPhase/WeatherSunPhase";

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

    const is_pressure = currentWeather && (currentWeather.main.pressure || currentWeather.main.grnd_level) ? true : false;
    // поучаем давление в милиметрах ртутного стоба
    const get_pressure = () => {
        if (!is_pressure) return;

        if (currentWeather!.main.pressure) {
            return Math.round(currentWeather!.main.pressure * 0.75);
        }

        return Math.round(currentWeather!.main.grnd_level! * 0.75);
    };

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

    return (
        <div className="CityCurrentWeather">
            {currentWeather ? (
                <>
                    <div className="CityCurrentWeather__head">
                        <h2 className="CityCurrentWeather__name">{currentWeather.name}</h2>
                        <WeatherNowTime weather={currentWeather} addClassName={["CityCurrentWeather__data_details"]} />
                        <WeatherBaseInfo weather={currentWeather} />

                        <div className="CityCurrentWeather__alt_info">
                            {currentWeather.snow ? (
                                <WeatherAltInfoTemplate slot_header={"Снег"} slot_main={currentWeather.snow["1h"]} slot_dop={"мм/ч"} />
                            ) : null}

                            {currentWeather.rain ? (
                                <WeatherAltInfoTemplate slot_header={"Дождь"} slot_main={currentWeather.rain["1h"]} slot_dop={"мм/ч"} />
                            ) : null}

                            {currentWeather.wind ? (
                                <WeatherAltInfoTemplate
                                    addClassName={["CityCurrentWeather__alt_wind"]}
                                    slot_header={"Ветер"}
                                    slot_main={<IconDirection direction={currentWeather.wind.deg} />}
                                    slot_dop={`${currentWeather.wind.speed} м/сек`}
                                />
                            ) : null}

                            <WeatherAltInfoTemplate
                                slot_header={"Влажность"}
                                slot_main={`${Math.round(currentWeather.main.humidity)}`}
                                slot_dop={"%"}
                            />

                            <WeatherAltInfoTemplate
                                slot_header={"Видимость"}
                                slot_main={`${currentWeather.visibility / 1000}`}
                                slot_dop={"Км"}
                            />

                            {is_pressure ? (
                                <WeatherAltInfoTemplate slot_header={"Давление"} slot_main={get_pressure()} slot_dop={"мм.рт.ст."} />
                            ) : null}

                            {currentWeather.clouds && currentWeather.clouds.all ? (
                                <WeatherAltInfoTemplate slot_header={"Облачность"} slot_main={currentWeather.clouds.all} slot_dop={"%"} />
                            ) : null}
                        </div>

                        <WeatherSunPhase
                            sun_hours={calc_sun_hours_details(
                                currentWeather.sys.sunrise,
                                currentWeather.sys.sunset,
                                currentWeather.timezone
                            )}
                            cityTime={currentWeather.dt}
                            cityTimezone={currentWeather.timezone}
                        />
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
