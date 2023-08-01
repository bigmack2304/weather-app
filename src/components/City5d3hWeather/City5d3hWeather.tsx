import React, { useEffect, useState, useRef } from "react";
import "./City5d3hWeather.scss";
import { use5d3hWeather } from "../../hooks/use5d3hWeather";
import { IconLoader } from "../../ui/IconLoader";
import type { TresponseObjListObj, TresponseObj } from "../../utils/fetch_5d3h_weather";
import { get_text_date } from "../../utils/util_functions";
import { City5d3hWeather__daysList } from "./City5d3hWeather_daysList";
import { City5d3hWeather_dayWeather } from "./City5d3hWeather_dayWeather";
import { City5d3hWeather_chartBlock } from "./City5d3hWeather_chartBlock";
import { useAppStoreSelector } from "../../redux/redux_hooks";

interface ICity5d3hWeatherProps {}

type TProps = Readonly<ICity5d3hWeatherProps>;

// преробразует таймштамп в строку типа ДД.ММ.ГГ Час:Мин
function dt_from_string(dt: number): string {
    let text_date = get_text_date(dt * 1000);
    return `${text_date.day_numUTC}.${text_date.month_numUTC}.${text_date.year_numUTC} ${text_date.hoursUTC}:${text_date.minutesUTC}`;
}

// преобразует dataIdRender в обьект с данными
function decode_dataIdRender(value: string) {
    type TDecoded = {
        date: string;
        index: string;
    };

    let decoded: TDecoded = {
        date: "0",
        index: "0",
    };

    if (value != "") {
        let temp = value.split("--");
        if (temp[0] && temp[1]) {
            decoded.date = temp[0];
            decoded.index = temp[1];
        }
    }

    return decoded;
}

function City5d3hWeather({}: TProps = {}) {
    const { lat, lon, cityName } = useAppStoreSelector((state) => state.weatherGeo);
    // sorted_days_weather и rawSortedWeather это массив, в котором сперва находятся другие массивы (это дни), в них находятся обьекты, каждый обьект это прогноз на опредеенное время.
    const [sorted_days_weather, set_sorted_days_weather] = useState<TresponseObjListObj[][]>([]); // двумерный массив, первый слой - дни, второй - погода на 3 - 9 - 15 - 21 часов
    const rawSortedWeather = useRef<TresponseObjListObj[][]>([]); // тотже массив что и выше но тут в каждом дне присутствуют все часы с интервалом в 3
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false); // отображать-ли значек загрузки
    const [isFetchError, setIsFetchError] = useState<boolean>(false); // ошибка загрузки данных
    const [dataIdRender, setDataIdRender] = useState<string>(""); // dt идонтефикатор дня, который мы отображаем // строка "дд.мм.гг_отображаемого_дня--index_его_в_массиве"

    const onErrorFetchWeather = () => {
        setIsLoadingVisible(false);
        setIsFetchError(true);
    };

    const onStartFetchWeather = () => {
        setIsLoadingVisible(true);
        setIsFetchError(false);
    };

    const onEndFetchWeather = () => {
        setIsLoadingVisible(false);
    };

    let [Weather, getWeather, forceGetWeather] = use5d3hWeather({
        cityName,
        lat,
        lon,
        errorCallback: onErrorFetchWeather,
        fetchStartCallback: onStartFetchWeather,
        fetchEndCallback: onEndFetchWeather,
    });

    const reload_comonent = () => {
        setIsFetchError(false);
        forceGetWeather();
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
            setDataIdRender(`${dt_from_string(sorted_days_weather[0][0].dt)}--0`);
        } // else {
        //     let decode_data_id_renderer = decode_dataIdRender(dataIdRender);
        //     setDataIdRender(
        //         `${dt_from_string(sorted_days_weather[Number(decode_data_id_renderer.index)][0].dt)}--${decode_data_id_renderer.index}`
        //     );
        // }
    }, [sorted_days_weather]);

    // после любого обновления прогноза
    useEffect(() => {
        if (!Weather) return;
        rawSortedWeather.current = sort_weather_response(Weather);
        set_sorted_days_weather(delete_undue_hours(rawSortedWeather.current));
        console.log(Weather);
    }, [Weather]);

    // после любого обновления компонента
    useEffect(() => {
        getWeather();
    });

    return (
        <div className="City5d3hWeather">
            {Weather && sorted_days_weather.length > 0 && !isLoadingVisible && !isFetchError ? (
                <>
                    <div className="City5d3hWeather__data_wrapper">
                        <City5d3hWeather__daysList
                            sortedForecast={sorted_days_weather}
                            setDataIdRender={setDataIdRender}
                            dataIdRender={dataIdRender}
                        />
                        <div className="City5d3hWeather__day_weather">
                            {dataIdRender !== "" ? (
                                <City5d3hWeather_dayWeather
                                    dataIdRender={dataIdRender}
                                    sorted_days_weather={sorted_days_weather}
                                    weather={Weather}
                                />
                            ) : null}
                        </div>
                    </div>
                    <div className="City5d3hWeather__chart_wrapper">
                        <City5d3hWeather_chartBlock rawSortedWeather={rawSortedWeather} dataIdRender={dataIdRender} />
                    </div>
                </>
            ) : null}
            {isFetchError ? (
                <div className="City5d3hWeather__fetch_error">
                    <p>Ошибка при загрузке данных о погоде на 5 дней.</p>
                    <button onClick={reload_comonent}>Перезагрузить</button>
                </div>
            ) : null}
            {isLoadingVisible ? (
                <div className="City5d3hWeather__loader_wrapper">
                    <IconLoader addClassName={["City5d3hWeather__loader"]} />
                </div>
            ) : null}
        </div>
    );
}

export { City5d3hWeather, dt_from_string, decode_dataIdRender };
export type { ICity5d3hWeatherProps };
