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
import { useAppStoreSelector, useAppStoreDispatch } from "../../redux/redux_hooks";
import { updateBackgroundClass } from "../../redux/slises/homePage";
import { updateCity } from "../../redux/slises/weather_lat_lon";
import { CITY_NO_NAME_MAP_TAP } from "../../utils/global_vars";
import { HocOnResizeUpdate } from "../../HOC/OnResizeUpdate/OnResizeUpdate";

interface ICityCurrentWeatherProps {}

type TProps = Readonly<ICityCurrentWeatherProps>;

const WeatherBaseInfo_onResizeUpd = HocOnResizeUpdate(WeatherBaseInfo);

function CityCurrentWeather({}: TProps = {}) {
    const { lat, lon, cityName, isAutoDetect } = useAppStoreSelector((state) => state.weatherGeo);
    const reduxStoreDispatch = useAppStoreDispatch();
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

    let [currentWeather, getWeather, forceGetWeather] = useCurrentWeather({
        cityName,
        lat,
        lon,
        errorCallback: onErrorCurrentWeather,
        fetchStartCallback: onStartCurrentWeather,
        fetchEndCallback: onEndCurrentWeather,
    });

    const reload_comonent = () => {
        setIsFetchError(false);
        forceGetWeather();
    };

    const is_pressure = currentWeather && (currentWeather.main.pressure || currentWeather.main.grnd_level) ? true : false;

    useEffect(() => {
        if (currentWeather) {
            console.log(currentWeather);
            let sun_data = calc_sun_hours_details(currentWeather.sys.sunrise, currentWeather.sys.sunset, currentWeather.timezone);
            reduxStoreDispatch(updateBackgroundClass(`Home--bg_${calc_backgraund_type(sun_data, currentWeather)}`));

            if (isAutoDetect) {
                reduxStoreDispatch(
                    updateCity({
                        cityName: currentWeather.name,
                        lat: lat ?? currentWeather.coord.lat,
                        lon: lon ?? currentWeather.coord.lon,
                    })
                );
            }
        }
    }, [currentWeather]);

    useEffect(() => {
        getWeather();
    });

    // определяем каким будет название искомого города
    const renderCityName = () => {
        // если это автоопределение, то название города берем из ответа о погоде с сервера
        if (isAutoDetect && cityName !== CITY_NO_NAME_MAP_TAP) {
            return (
                <>
                    {cityName} <span className="CityCurrentWeather__name_auto">(автоопределение)</span>
                </>
            );
        }

        // если мы нажали по карте то лучше если название будет таким, потомучто названия там определяются так себе
        if (cityName == CITY_NO_NAME_MAP_TAP) {
            return <>Точка на карте</>;
        }

        // в остальных случаях название берем из стора
        return <>{cityName}</>;
    };

    return (
        <div className="CityCurrentWeather">
            {currentWeather && !isLoadingVisible && !isFetchError ? (
                <>
                    <div className="CityCurrentWeather__head">
                        <h2 className="CityCurrentWeather__name">{renderCityName()}</h2>
                        <WeatherNowTime
                            times={{ dt: currentWeather.dt, timezone: currentWeather.timezone }}
                            get_hours={false}
                            get_minutes={false}
                            addClassName={["CityCurrentWeather__data_details"]}
                        />
                    </div>

                    <div className="CityCurrentWeather__main_wrapper">
                        <div className="CityCurrentWeather__main">
                            <WeatherBaseInfo_onResizeUpd
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
            ) : null}

            {isFetchError ? (
                <div className="CityCurrentWeather__fetch_error">
                    <p>Ошибка при загрузке данных о текущей погоде.</p>
                    <button onClick={reload_comonent}>Перезагрузить</button>
                </div>
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
