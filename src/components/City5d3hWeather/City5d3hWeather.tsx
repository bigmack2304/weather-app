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
    const [sorted_days_weather, set_sorted_days_weather] = useState<TresponseObjListObj[][]>([]); // двумерный массив, первый слой - дни, второй - погода на 3 - 9 - 15 - 21 часов
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false);
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

    const dt_from_string = (dt: number): string => {
        let text_date = get_text_date(dt * 1000);
        return `${text_date.day_numUTC}.${text_date.month_numUTC}.${text_date.year_numUTC} ${text_date.hoursUTC}:${text_date.minutesUTC}`;
    };

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
            let day_id = (function () {
                let text_date = get_text_date(forecast.dt * 1000);
                return `${text_date.day_numUTC}.${text_date.month_numUTC}.${text_date.year_numUTC}`;
            })();

            if (is_unique(day_id)) {
                days_map.push(day_id);
            }
        }

        days_map.forEach((day, index) => {
            result.push([]);
            for (let forecast of weather.list) {
                let day_id = (function () {
                    let text_date = get_text_date(forecast.dt * 1000);
                    return `${text_date.day_numUTC}.${text_date.month_numUTC}.${text_date.year_numUTC}`;
                })();

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
                let day_str = dt_from_string(day_data.dt);
                if (day_str.includes("3:0") || day_str.includes("9:0") || day_str.includes("15:0") || day_str.includes("21:0")) {
                    result[i].push(day_data);
                }
            }
        }

        return result;
    };

    // после сортировки ответа о прогнозе
    useEffect(() => {
        // если не один день не выбран, выбираем первый по умолчанию
        if (sorted_days_weather.length > 0 && dataIdRender == "") {
            // setDataIdRender(sorted_days_weather[0][0].dt_txt);
            setDataIdRender(dt_from_string(sorted_days_weather[0][0].dt));
            console.log(sorted_days_weather);
        }
    }, [sorted_days_weather]);

    // после любого обновления прогноза
    useEffect(() => {
        if (Weather) {
            set_sorted_days_weather(delete_undue_hours(sort_weather_response(Weather)));
            console.log(Weather);
        }
    }, [Weather]);

    // после любого обновления компонента
    useEffect(() => {
        getWeather();
    });

    return (
        <div className="City5d3hWeather">
            {Weather && sorted_days_weather.length > 0 ? (
                <div className="City5d3hWeather__data_wrapper">
                    <div className="City5d3hWeather__days_list">
                        {sorted_days_weather.map((day) => {
                            let date_txt = get_text_date(new Date(day[0].dt * 1000));

                            const onClick = (e: React.MouseEvent, data_id: string) => {
                                setDataIdRender(data_id);
                            };

                            return (
                                <React.Fragment key={day[0].dt}>
                                    <WeatherAltInfoTemplate
                                        slot_header={date_txt.day_name_short}
                                        slot_main={date_txt.dayNum_monthNameUTC}
                                        onClick={onClick}
                                        data_id={dt_from_string(day[0].dt)}
                                        addClassName={dataIdRender == dt_from_string(day[0].dt) ? ["City5d3hWeather__day--active"] : []}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <div className="City5d3hWeather__day_weather">
                        {dataIdRender !== ""
                            ? (function () {
                                  // выводим почасовые прогнозы для выбронного дня
                                  // сперва определяем положение нужного дня в массиве дней
                                  let day_id = 0;

                                  for (let i = 0; i < sorted_days_weather.length; i++) {
                                      day_id = i;
                                      if (dt_from_string(sorted_days_weather[i][0].dt) == dataIdRender) {
                                          break;
                                      }
                                  }

                                  // теперь обходим почасовые прогнозы и выводим разметку
                                  return sorted_days_weather[day_id].map((forecast) => {
                                      let calc_sunrise = () => {
                                          let time = Weather!.city.sunrise;

                                          if (day_id == 0) {
                                              return time;
                                          }

                                          for (let i = 0; i < day_id; i++) {
                                              time += 86400;
                                          }

                                          return time;
                                      };

                                      let calc_sunset = () => {
                                          let time = Weather!.city.sunset;

                                          if (day_id == 0) {
                                              return time;
                                          }

                                          for (let i = 0; i < day_id; i++) {
                                              time += 86400;
                                          }

                                          return time;
                                      };

                                      return (
                                          <div
                                              key={forecast.dt_txt}
                                              className="City5d3hWeather__day_time_weather"
                                              style={{ marginTop: "10px" }}
                                          >
                                              <div>
                                                  {(function () {
                                                      let text_date = get_text_date(forecast.dt * 1000);
                                                      return `${text_date.hoursUTC}:${text_date.minutesUTC}`;
                                                  })()}
                                              </div>
                                              <WeatherIcon
                                                  weather_data={{
                                                      // этот компонент изначально был расчитан на текущую погоду, поэтому там требовалось сдвигать sunrise. sunset. dt на timezone, сдесь для dt это не нужно
                                                      sunrise: calc_sunrise(), // api не предостовляет информации о восходе и заходе на будующие дни, поэтому для них будем брать время восхода такоеже как и в текущем дне, для этого секундный таймштамп увеличиваем на 1 день
                                                      sunset: calc_sunset(),
                                                      timezone: Weather!.city.timezone, // timezone нужен для корректного расчета sunrise и sunset
                                                      dt: forecast.dt - Weather!.city.timezone, // при расчетах WeatherIcon сдвигает это время на timezone, но в данном случае мы это невелируем, сдивигая его в противоположную сторону
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
