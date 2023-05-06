import React, { useContext, useEffect, useState, useRef } from "react";
import "./City5d3hWeather.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { use5d3hWeather } from "../../hooks/use5d3hWeather";
import { IconLoader } from "../../ui/IconLoader";
import type { TresponseObjListObj, TresponseObj } from "../../utils/fetch_5d3h_weather";
import { WeatherAltInfoTemplate } from "../WeatherAltInfoTemplate/WeatherAltInfoTemplate";
import { get_text_date, deg_to_compass, addon_map } from "../../utils/util_functions";
import { WeatherIcon } from "./../WeatherIcon/WeatherIcon";
import { IconDirection } from "../../ui/IconDirection";
import { HoverHint } from "../../HOC/HoverHint/HoverHint";
import { ChartTypeOne } from "../ChartTypeOne/ChartTypeOne";

interface ICity5d3hWeatherProps {}

type TProps = Readonly<ICity5d3hWeatherProps>;

function City5d3hWeather({}: TProps = {}) {
    const { lat, lon, cityName } = useContext(WeatherContext);
    const [sorted_days_weather, set_sorted_days_weather] = useState<TresponseObjListObj[][]>([]); // двумерный массив, первый слой - дни, второй - погода на 3 - 9 - 15 - 21 часов
    const rawSortedWeather = useRef<TresponseObjListObj[][]>([]); // тотже массив что и выше но тут в каждом дне присутствуют все часы с интервалом в 3
    const dayIndexRendered = useRef<number>(0); // индекс дня в первом слое sorted_days_weather. День, информация о котором в данный момент выводится на экран
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false); // отображать-ли значек загрузки
    const [dataIdRender, setDataIdRender] = useState<string>(""); // dt идонтефикатор дня, который мы отображаем
    const refChartWrapper = useRef<HTMLDivElement>(null); // ссылка на DOM контейнер для графика
    const [chartDataType, setChartDataType] = useState<string>("Температура"); // dt идонтефикатор дня, который мы отображаем

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

            if (result[i].length == 0) {
                result.splice(i, 1); // если после чистки остался пустой подмассив то нужно его удалить
            }
        }

        return result;
    };

    // после сортировки ответа о прогнозе
    useEffect(() => {
        // если не один день не выбран, выбираем первый по умолчанию
        if (sorted_days_weather.length > 0 && dataIdRender == "") {
            setDataIdRender(dt_from_string(sorted_days_weather[0][0].dt));
            console.log(sorted_days_weather);
        }
    }, [sorted_days_weather]);

    // после любого обновления прогноза
    useEffect(() => {
        if (!Weather) return;
        rawSortedWeather.current = sort_weather_response(Weather);
        set_sorted_days_weather(delete_undue_hours(rawSortedWeather.current));
        console.log(Weather);
    }, [Weather]);

    useEffect(() => {
        if (!refChartWrapper.current) return;

        const resizeCallback = () => {
            if (!refChartWrapper.current) return;
            const chartWrapperSizes = refChartWrapper.current!.getBoundingClientRect();
            refChartWrapper.current!.style.height = `${chartWrapperSizes.width / 2}px`;
        };

        resizeCallback();

        window.addEventListener("resize", resizeCallback);

        return () => {
            window.removeEventListener("resize", resizeCallback);
        };
    }, [refChartWrapper.current, dayIndexRendered.current]);

    // после любого обновления компонента
    useEffect(() => {
        getWeather();
    });
    return (
        <div className="City5d3hWeather">
            {Weather && sorted_days_weather.length > 0 && !isLoadingVisible ? (
                <>
                    <div className="City5d3hWeather__data_wrapper">
                        <div className="City5d3hWeather__days_list">
                            {sorted_days_weather.map((day) => {
                                let date_txt = get_text_date(new Date(day[0].dt * 1000));

                                const onClick = (e: React.MouseEvent, data_id: string) => {
                                    setDataIdRender(data_id);
                                };

                                const gen_classnames = () => {
                                    let classes: string[] = [];

                                    if (dataIdRender == dt_from_string(day[0].dt)) {
                                        classes.push("City5d3hWeather__day--active");
                                    }

                                    if (
                                        date_txt.day_name_short.toLocaleUpperCase() == "СБ" ||
                                        date_txt.day_name_short.toLocaleUpperCase() == "ВС"
                                    ) {
                                        classes.push("City5d3hWeather__day--weekend");
                                    }

                                    return classes;
                                };

                                return (
                                    <React.Fragment key={day[0].dt}>
                                        <WeatherAltInfoTemplate
                                            slot_header={date_txt.day_name_short}
                                            slot_main={date_txt.dayNum_monthNameUTC}
                                            onClick={onClick}
                                            data_id={dt_from_string(day[0].dt)}
                                            addClassName={gen_classnames()}
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

                                      dayIndexRendered.current = day_id;

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
                                                          sunrise: calc_sunrise(), // api не предостовляет информации о восходе и заходе на будующие дни, поэтому для них будем брать время восхода такоеже как и в текущем дне, для этого секундный таймштамп увеличиваем на 1 день
                                                          sunset: calc_sunset(),
                                                          timezone: Weather!.city.timezone, // timezone нужен для корректного расчета sunrise и sunset
                                                          dt: forecast.dt - Weather!.city.timezone, // при расчетах WeatherIcon сдвигает это время на timezone, но в данном случае мы это невелируем, сдивигая его в противоположную сторону
                                                          weather_id: forecast.weather[0].id,
                                                      }}
                                                  />
                                                  <HoverHint
                                                      hoverText={`Вероятность осадков ${addon_map(forecast.pop, 0.0, 1.0, 0, 100).toFixed(
                                                          0
                                                      )}%`}
                                                  >
                                                      <span className="City5d3hWeather__day_time_desc">
                                                          {forecast.weather[0].description}
                                                      </span>
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
                                                      <span className="City5d3hWeather__day_time_temp">{`${forecast.main.temp.toFixed(
                                                          1
                                                      )} °c`}</span>
                                                  </HoverHint>
                                              </div>
                                          );
                                      });
                                  })()
                                : null}
                        </div>
                    </div>
                    <div className="City5d3hWeather__chart_wrapper">
                        <div className="City5d3hWeather__chart_type_list">
                            {(function () {
                                const onClickTemp = (e: React.MouseEvent, data_id: string) => {
                                    setChartDataType(data_id);
                                };

                                const onClickRainfall = (e: React.MouseEvent, data_id: string) => {
                                    setChartDataType(data_id);
                                };

                                return (
                                    <>
                                        <WeatherAltInfoTemplate
                                            slot_header="Температура"
                                            data_id={"Температура"}
                                            onClick={onClickTemp}
                                            addClassName={[
                                                chartDataType == "Температура" ? "City5d3hWeather__day--active" : "",
                                                "City5d3hWeather__chart_type_item",
                                            ]}
                                        />
                                        <WeatherAltInfoTemplate
                                            slot_header="Осадки"
                                            data_id={"Осадки"}
                                            onClick={onClickRainfall}
                                            addClassName={[
                                                chartDataType == "Осадки" ? "City5d3hWeather__day--active" : "",
                                                "City5d3hWeather__chart_type_item",
                                            ]}
                                        />
                                    </>
                                );
                            })()}
                        </div>
                        <div className="City5d3hWeather__chart" ref={refChartWrapper}>
                            <ChartTypeOne
                                chartData={rawSortedWeather.current[dayIndexRendered.current].map((day) => {
                                    return {
                                        name: (function () {
                                            let text_date = get_text_date(day.dt * 1000);
                                            return `${text_date.hoursUTC}:${text_date.minutesUTC}`;
                                        })(),
                                        [chartDataType]:
                                            chartDataType == "Температура"
                                                ? day.main.temp
                                                : day.rain
                                                ? day.rain["3h"]
                                                : day.snow
                                                ? day.snow["3h"]
                                                : 0,
                                    };
                                })}
                                pointsData={[{ pointName: chartDataType, pointGradientCloror: "#f0f8ff", pointLineCloror: "#d33d29" }]}
                                toolTipPostfix={chartDataType == "Температура" ? "°c" : "мм/3ч"}
                            />
                        </div>
                    </div>
                </>
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
