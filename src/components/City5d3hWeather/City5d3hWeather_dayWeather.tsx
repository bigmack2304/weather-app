import React, { useEffect } from "react";
import { decode_dataIdRender } from "./City5d3hWeather";
import type { TresponseObjListObj } from "../../utils/fetch_5d3h_weather";
import type { TResponse } from "../../utils/fetch_5d3h_weather";
import { WeatherIcon } from "../WeatherIcon/WeatherIcon";
import { HoverHint } from "../../HOC/HoverHint/HoverHint";
import { addon_map, deg_to_compass, get_text_date, is_mobile_screen_size } from "../../utils/util_functions";
import { IconDirection } from "../../ui/IconDirection";
import "./City5d3hWeather.scss";

type TCity5d3hWeather_dayWeatherProps = {
    dataIdRender: string;
    sorted_days_weather: TresponseObjListObj[][];
    weather: TResponse;
};

type TProps = Readonly<TCity5d3hWeather_dayWeatherProps>;

function City5d3hWeather_dayWeather({ dataIdRender, sorted_days_weather, weather }: TProps) {
    let day_id = Number(decode_dataIdRender(dataIdRender).index);

    // api не предоставляет время восхода и заката для будующих дней, поэтому выщитываем его самостоятельно, исходя из текущего дня

    const calc_sunrise = (dt: number, timezone: number) => {
        let base_sunrise = weather!.city.sunrise;
        let jsDate = new Date((base_sunrise + timezone) * 1000);
        let jsDate_h = jsDate.getUTCHours();
        let jsDate_m = jsDate.getUTCMinutes();

        let calced_sunrise = new Date(dt * 1000);
        calced_sunrise.setUTCHours(jsDate_h);
        calced_sunrise.setUTCMinutes(jsDate_m);

        return calced_sunrise.getTime() / 1000 - timezone;
    };

    const calc_sunset = (dt: number, timezone: number) => {
        let base_sunset = weather!.city.sunset;
        let jsDate = new Date((base_sunset + timezone) * 1000);
        let jsDate_h = jsDate.getUTCHours();
        let jsDate_m = jsDate.getUTCMinutes();

        let calced_sunset = new Date(dt * 1000);
        calced_sunset.setUTCHours(jsDate_h);
        calced_sunset.setUTCMinutes(jsDate_m);

        return calced_sunset.getTime() / 1000 - timezone;
    };

    return (
        <>
            {/* разметка будет двух типов: под мобильник и десктоп */}
            {!is_mobile_screen_size() ? (
                <>{desctop_html(day_id, sorted_days_weather, weather, calc_sunrise, calc_sunset)}</>
            ) : (
                <>{mobile_html(day_id, sorted_days_weather, weather, calc_sunrise, calc_sunset)}</>
            )}
        </>
    );
}

function mobile_html(
    day_id: number,
    sorted_days_weather: TresponseObjListObj[][],
    weather: TResponse,
    calc_sunrise: (val: number, val2: number) => number,
    calc_sunset: (val: number, val2: number) => number
) {
    return (
        <>
            {sorted_days_weather[day_id].map((forecast) => {
                return (
                    <div key={forecast.dt} className="City5d3hWeather__day_time_weather">
                        <span className="City5d3hWeather__day_time_time">
                            {(function () {
                                let text_date = get_text_date(forecast.dt * 1000);
                                return `${text_date.hoursUTC}:${text_date.minutesUTC}`;
                            })()}
                        </span>

                        <HoverHint
                            hoverText={
                                <>
                                    <div className="City5d3hWeather__day_time_hint">
                                        <div>{forecast.weather[0].description}</div>
                                        <div>{`вероятность осадков ${addon_map(forecast.pop, 0.0, 1.0, 0, 100).toFixed(0)}%`}</div>
                                        {forecast.rain ? <div>{`${forecast.rain["3h"]} мм/3ч`}</div> : null}
                                        {forecast.snow ? <div>{`${forecast.snow["3h"]} мм/3ч`}</div> : null}
                                    </div>
                                </>
                            }
                        >
                            <WeatherIcon
                                weather_data={{
                                    // этот компонент изначально был расчитан на текущую погоду, поэтому там требовалось сдвигать sunrise. sunset. dt на timezone, сдесь для dt это не нужно
                                    sunrise: calc_sunrise(forecast.dt, weather!.city.timezone), // api не предостовляет информации о восходе и заходе на будующие дни, поэтому для них будем брать время восхода такоеже как и в текущем дне, для этого секундный таймштамп увеличиваем на 1 день
                                    sunset: calc_sunset(forecast.dt, weather!.city.timezone),
                                    timezone: weather!.city.timezone, // timezone нужен для корректного расчета sunrise и sunset
                                    dt: forecast.dt - weather!.city.timezone, // при расчетах WeatherIcon сдвигает это время на timezone, но в данном случае мы это невелируем, сдивигая его в противоположную сторону
                                    weather_id: forecast.weather[0].id,
                                }}
                            />
                        </HoverHint>

                        {forecast.wind ? (
                            <div className="City5d3hWeather__day_time_wnd">
                                <HoverHint
                                    hoverText={
                                        <>
                                            <div className="City5d3hWeather__day_time_hint">
                                                <div>{deg_to_compass(forecast.wind.deg)}</div>
                                                <div>{forecast.wind.speed.toFixed(1)} м/сек</div>
                                            </div>
                                        </>
                                    }
                                >
                                    <IconDirection direction={forecast.wind.deg} />
                                </HoverHint>
                            </div>
                        ) : null}
                        <HoverHint hoverText={`Ощущается как: ${forecast.main.feels_like.toFixed(1)} °c`}>
                            <span className="City5d3hWeather__day_time_temp">{`${forecast.main.temp.toFixed(1)} °c`}</span>
                        </HoverHint>
                    </div>
                );
            })}
        </>
    );
}

function desctop_html(
    day_id: number,
    sorted_days_weather: TresponseObjListObj[][],
    weather: TResponse,
    calc_sunrise: (val: number, val2: number) => number,
    calc_sunset: (val: number, val2: number) => number
) {
    return (
        <>
            {sorted_days_weather[day_id].map((forecast) => {
                return (
                    <div key={forecast.dt} className="City5d3hWeather__day_time_weather">
                        <span className="City5d3hWeather__day_time_time">
                            {(function () {
                                let text_date = get_text_date(forecast.dt * 1000);
                                return `${text_date.hoursUTC}:${text_date.minutesUTC}`;
                            })()}
                        </span>
                        <WeatherIcon
                            weather_data={{
                                // этот компонент изначально был расчитан на текущую погоду, поэтому там требовалось сдвигать sunrise. sunset. dt на timezone, сдесь для dt это не нужно
                                sunrise: calc_sunrise(forecast.dt, weather!.city.timezone), // api не предостовляет информации о восходе и заходе на будующие дни, поэтому для них будем брать время восхода такоеже как и в текущем дне, для этого секундный таймштамп увеличиваем на 1 день
                                sunset: calc_sunset(forecast.dt, weather!.city.timezone),
                                timezone: weather!.city.timezone, // timezone нужен для корректного расчета sunrise и sunset
                                dt: forecast.dt - weather!.city.timezone, // при расчетах WeatherIcon сдвигает это время на timezone, но в данном случае мы это невелируем, сдивигая его в противоположную сторону
                                weather_id: forecast.weather[0].id,
                            }}
                        />
                        <HoverHint hoverText={`Вероятность осадков ${addon_map(forecast.pop, 0.0, 1.0, 0, 100).toFixed(0)}%`}>
                            <span className="City5d3hWeather__day_time_desc">{forecast.weather[0].description}</span>
                        </HoverHint>
                        {forecast.rain ? <span>{`${forecast.rain["3h"]} мм/3ч`}</span> : null}
                        {forecast.snow ? <span>{`${forecast.snow["3h"]} мм/3ч`}</span> : null}
                        {forecast.wind ? (
                            <div className="City5d3hWeather__day_time_wnd">
                                <span>{forecast.wind.speed.toFixed(1)} м/сек</span>
                                <HoverHint hoverText={deg_to_compass(forecast.wind.deg)}>
                                    <IconDirection direction={forecast.wind.deg} />
                                </HoverHint>
                            </div>
                        ) : null}
                        <HoverHint hoverText={`Ощущается как: ${forecast.main.feels_like.toFixed(1)} °c`}>
                            <span className="City5d3hWeather__day_time_temp">{`${forecast.main.temp.toFixed(1)} °c`}</span>
                        </HoverHint>
                    </div>
                );
            })}
        </>
    );
}

export { City5d3hWeather_dayWeather };

// if (now_timestamp > sun_data.sunset.timestamp || now_timestamp < sun_data.sunrise.timestamp) {
// if (1684443600000 > 1684531080000 || 1684443600000 < 1684472700000) {
