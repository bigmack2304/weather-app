import React, { useEffect, useState } from "react";
import "./CityCurrentWeather.scss";
import { useCurrentWeather } from "../../hooks/useCurrentWeather";
import { IconDirection } from "../../ui/IconDirection";
import { calc_backgraund_type, calc_sun_hours_details, convert_hpa_to_mmRtSt, deg_to_compass } from "../../utils/util_functions";
import { IconLoader } from "../../ui/IconLoader";
import { WeatherNowTime } from "../WeatherNowTime/WeatherNowTime";
import { WeatherBaseInfo } from "../WeatherBaseInfo/WeatherBaseInfo";
import { WeatherAltInfoTemplate } from "../WeatherAltInfoTemplate/WeatherAltInfoTemplate";
import "./../../fonts/acline/acline.css";
import { HoverHint } from "../../HOC/HoverHint/HoverHint";
import { WeatherSunPhase } from "../WeatherSunPhase/WeatherSunPhase";
import { useAppStoreSelector } from "../../redux/redux_hooks";

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
    const { lat, lon, cityName } = useAppStoreSelector((state) => state.weatherGeo);
    const { pageSelector: homePageSelector } = useAppStoreSelector((state) => state.homePage);
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false);
    const [isFetchError, setIsFetchError] = useState<boolean>(false); // ошибка загрузки данных

    const onErrorCurrentWeather = () => {
        setIsLoadingVisible(false);
        setIsFetchError(true);
    };

    const onStartCurrentWeather = () => {
        setIsLoadingVisible(true);
        setIsFetchError(false);
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

    useEffect(() => {
        if (currentWeather) {
            console.log(currentWeather);

            let sun_data = calc_sun_hours_details(currentWeather.sys.sunrise, currentWeather.sys.sunset, currentWeather.timezone);
            let homepage: HTMLElement | null = null;

            if (homePageSelector && homePageSelector != "") {
                homepage = document.querySelector<HTMLElement>(homePageSelector);
            }

            if (homepage) {
                for (let elem of Array.from(homepage.classList)) {
                    if ((elem as string).startsWith("Home--bg_")) {
                        homepage.classList.remove(elem);
                    }
                }
                homepage.classList.add(`Home--bg_${calc_backgraund_type(sun_data, currentWeather)}`);
            }
        }
    }, [currentWeather]);

    useEffect(() => {
        getWeather();
    });

    return (
        <div className="CityCurrentWeather">
            {currentWeather && !isLoadingVisible && !isFetchError ? (
                <>
                    <div className="CityCurrentWeather__head">
                        <h2 className="CityCurrentWeather__name">{cityName}</h2>
                        <WeatherNowTime
                            times={{ dt: currentWeather.dt, timezone: currentWeather.timezone }}
                            get_hours={false}
                            get_minutes={false}
                            addClassName={["CityCurrentWeather__data_details"]}
                        />
                    </div>

                    <div className="CityCurrentWeather__main_wrapper">
                        <div className="CityCurrentWeather__main">
                            <WeatherBaseInfo
                                weather_data={{
                                    sunrise: currentWeather.sys.sunrise,
                                    sunset: currentWeather.sys.sunset,
                                    timezone: currentWeather.timezone,
                                    dt: currentWeather.dt,
                                    weather_id: currentWeather.weather[0].id,
                                    description: currentWeather.weather[0].description,
                                    temp: currentWeather.main.temp,
                                    feels_like: currentWeather.main.feels_like,
                                }}
                            />

                            <div className="CityCurrentWeather__alt_info_wrapper">
                                {currentWeather.snow ? (
                                    <WeatherAltInfoTemplate
                                        addClassName={["CityCurrentWeather__alt_info"]}
                                        slot_header={"Снег"}
                                        slot_main={currentWeather.snow["1h"]}
                                        slot_dop={"мм/ч"}
                                    />
                                ) : null}

                                {currentWeather.rain ? (
                                    <WeatherAltInfoTemplate
                                        addClassName={["CityCurrentWeather__alt_info"]}
                                        slot_header={"Дождь"}
                                        slot_main={currentWeather.rain["1h"]}
                                        slot_dop={"мм/ч"}
                                    />
                                ) : null}

                                <WeatherAltInfoTemplate
                                    addClassName={["CityCurrentWeather__alt_info"]}
                                    slot_header={"Влажность"}
                                    slot_main={`${Math.round(currentWeather.main.humidity)}`}
                                    slot_dop={"%"}
                                />

                                {currentWeather.clouds && currentWeather.clouds.all ? (
                                    <WeatherAltInfoTemplate
                                        addClassName={["CityCurrentWeather__alt_info"]}
                                        slot_header={"Облачность"}
                                        slot_main={currentWeather.clouds.all}
                                        slot_dop={"%"}
                                    />
                                ) : null}

                                {is_pressure ? (
                                    <WeatherAltInfoTemplate
                                        addClassName={["CityCurrentWeather__alt_info"]}
                                        slot_header={"Давление"}
                                        slot_main={convert_hpa_to_mmRtSt({
                                            pressure: currentWeather.main.pressure,
                                            grnd_level: currentWeather.main.grnd_level,
                                        })}
                                        slot_dop={"мм.рт.ст."}
                                    />
                                ) : null}

                                {currentWeather.wind ? (
                                    <WeatherAltInfoTemplate
                                        addClassName={["CityCurrentWeather__alt_wind", "CityCurrentWeather__alt_info"]}
                                        slot_header={"Ветер"}
                                        slot_main={
                                            <HoverHint hoverText={deg_to_compass(currentWeather.wind.deg)}>
                                                <IconDirection direction={currentWeather.wind.deg} />
                                            </HoverHint>
                                        }
                                        slot_dop={`${currentWeather.wind.speed} м/сек`}
                                    />
                                ) : null}

                                <WeatherAltInfoTemplate
                                    addClassName={["CityCurrentWeather__alt_info"]}
                                    slot_header={"Видимость"}
                                    slot_main={`${(currentWeather.visibility / 1000).toPrecision(2)}`}
                                    slot_dop={"Км"}
                                />
                            </div>

                            <WeatherSunPhase
                                addClassName={["CityCurrentWeather__sun_phase"]}
                                sun_hours={calc_sun_hours_details(
                                    currentWeather.sys.sunrise,
                                    currentWeather.sys.sunset,
                                    currentWeather.timezone
                                )}
                                cityTime={currentWeather.dt}
                                cityTimezone={currentWeather.timezone}
                            />
                        </div>
                    </div>
                </>
            ) : !isLoadingVisible && !isFetchError ? (
                <>
                    <div className="CityCurrentWeather__default">
                        <p className="CityCurrentWeather__default_text">Начните поиск.</p>
                    </div>
                </>
            ) : null}
            {isFetchError ? <div className="CityCurrentWeather__fetch_error">Ошибка при загрузки данных о текущей погоде.</div> : null}
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
