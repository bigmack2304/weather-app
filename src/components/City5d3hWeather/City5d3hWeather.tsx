import React, { useContext, useEffect, useState, useRef } from "react";
import "./City5d3hWeather.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { use5d3hWeather } from "../../hooks/use5d3hWeather";
import { IconLoader } from "../../ui/IconLoader";
import type { TresponseObjListObj, TresponseObj } from "../../utils/fetch_5d3h_weather";
import { WeatherAltInfoTemplate } from "../WeatherAltInfoTemplate/WeatherAltInfoTemplate";
import { get_text_date } from "../../utils/util_functions";
import { WeatherIcon } from "./../WeatherIcon/WeatherIcon";

interface ICity5d3hWeatherProps {}

type TProps = Readonly<ICity5d3hWeatherProps>;

function City5d3hWeather({}: TProps = {}) {
    const { lat, lon, cityName } = useContext(WeatherContext);
    const sorted_days_weather = useRef<TresponseObjListObj[][]>([]); // двумерный массив, первый слой - дни, второй - погода на 3 - 9 - 15 - 21 часов
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false);
    const [isResponseSorted, setIsResponseSorted] = useState<boolean>(false);
    const [dataIdRender, setDataIdRender] = useState<string>("");

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

    // сортирует ответ на массив дней с прогнозами
    const sort_weather_response = (weather: TresponseObj) => {
        let days_map: string[] = [];
        let result: TresponseObjListObj[][] = [];

        const is_unique = (val: string) => {
            let result = true;

            if (days_map.length == 0) {
                return true;
            }

            for (let elem of days_map) {
                if (val == elem) {
                    result = false;
                    break;
                }
                result = true;
            }

            return result;
        };

        for (let forecast of weather.list) {
            let day_id = forecast.dt_txt.slice(0, forecast.dt_txt.indexOf(" ") > 0 ? forecast.dt_txt.indexOf(" ") : forecast.dt_txt.length);

            if (is_unique(day_id)) {
                days_map.push(day_id);
            }
        }

        days_map.forEach((day, index) => {
            result.push([]);
            for (let forecast of weather.list) {
                let day_id = forecast.dt_txt.slice(
                    0,
                    forecast.dt_txt.indexOf(" ") > 0 ? forecast.dt_txt.indexOf(" ") : forecast.dt_txt.length
                );
                if (day == day_id) {
                    result[index].push(forecast);
                }
            }
        });

        return result;
    };

    // оставляет прогнозы на 3-9-15-21 часов
    const delete_undue_hours = (sorted_weather: Readonly<TresponseObjListObj[][]>) => {
        let result: TresponseObjListObj[][] = [];

        for (let i = 0; i < sorted_weather.length; i++) {
            result.push([]);

            for (let day_data of sorted_weather[i]) {
                if (
                    day_data.dt_txt.includes("3:00") ||
                    day_data.dt_txt.includes("9:00") ||
                    day_data.dt_txt.includes("15:00") ||
                    day_data.dt_txt.includes("21:00")
                ) {
                    result[i].push(day_data);
                }
            }
        }

        return result;
    };

    useEffect(() => {
        if (Weather) {
            sorted_days_weather.current = delete_undue_hours(sort_weather_response(Weather));
            console.log(Weather);
            console.log(sorted_days_weather.current);
            setIsResponseSorted(true);

            // если не один день не выбран, выбираем первый по умолчанию
            if (dataIdRender == "") {
                setDataIdRender(sorted_days_weather.current[0][0].dt_txt);
            }
        }
    }, [Weather]);

    useEffect(() => {
        getWeather();
    });

    return (
        <div className="City5d3hWeather">
            {Weather ? (
                <div className="City5d3hWeather__data_wrapper">
                    <div className="City5d3hWeather__days_list">
                        {isResponseSorted ? (
                            <>
                                {sorted_days_weather.current.map((day) => {
                                    let date_txt = get_text_date(new Date(day[0].dt_txt.slice(0, day[0].dt_txt.indexOf(" "))));

                                    const onClick = (e: React.MouseEvent, data_id: string) => {
                                        setDataIdRender(data_id);
                                    };

                                    return (
                                        <React.Fragment key={day[0].dt_txt}>
                                            <WeatherAltInfoTemplate
                                                slot_header={date_txt.day_name_short}
                                                slot_main={date_txt.dayNum_monthNameUTC}
                                                onClick={onClick}
                                                data_id={day[0].dt_txt}
                                                addClassName={dataIdRender == day[0].dt_txt ? ["City5d3hWeather__day--active"] : []}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        ) : null}
                    </div>
                    <div className="City5d3hWeather__day_weather">
                        {dataIdRender !== ""
                            ? (function () {
                                  // выводим почасовые прогнозы для выбронного дня
                                  // сперва определяем положение нужного дня в массиве дней
                                  let day_id = 0;

                                  for (let i = 0; i < sorted_days_weather.current.length; i++) {
                                      day_id = i;
                                      if (sorted_days_weather.current[i][0].dt_txt == dataIdRender) {
                                          break;
                                      }
                                  }

                                  // теперь обходим почасовые прогнозы и выводим разметку
                                  return sorted_days_weather.current[day_id].map((forecast) => {
                                      return (
                                          <div
                                              key={forecast.dt_txt}
                                              className="City5d3hWeather__day_time_weather"
                                              style={{ marginTop: "10px" }}
                                          >
                                              <div>{forecast.dt_txt.slice(forecast.dt_txt.indexOf(" "), forecast.dt_txt.length)}</div>
                                              <WeatherIcon
                                                  weather_data={{
                                                      sunrise: Weather!.city.sunrise,
                                                      sunset: Weather!.city.sunset,
                                                      timezone: Weather!.city.timezone,
                                                      //dt: forecast.dt,
                                                      dt: new Date(forecast.dt_txt).getTime() / 1000,
                                                      weather_id: forecast.weather[0].id,
                                                  }}
                                              />
                                              <div>{forecast.weather[0].description}</div>
                                              <div>{`Температура ${forecast.main.temp}°c`}</div>
                                              <hr />
                                          </div>
                                      );
                                  });
                              })()
                            : null}
                    </div>
                </div>
            ) : !isLoadingVisible ? (
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
