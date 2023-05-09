import React, { useContext, useEffect, useState, useRef } from "react";
import "./City5d3hWeather.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import { use5d3hWeather } from "../../hooks/use5d3hWeather";
import { IconLoader } from "../../ui/IconLoader";
import type { TresponseObjListObj, TresponseObj } from "../../utils/fetch_5d3h_weather";
import { get_text_date } from "../../utils/util_functions";
import { City5d3hWeather__daysList } from "./City5d3hWeather_daysList";
import { City5d3hWeather_dayWeather } from "./City5d3hWeather_dayWeather";
import { City5d3hWeather_chartTypeList } from "./City5d3hWeather_chartTypeList";
import { City5d3hWeather_chart } from "./City5d3hWeather_chart";

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
    const { lat, lon, cityName } = useContext(WeatherContext);
    // sorted_days_weather и rawSortedWeather это массив, в котором сперва находятся другие массивы (это дни), в них находятся обьекты, каждый обьект это прогноз на опредеенное время.
    const [sorted_days_weather, set_sorted_days_weather] = useState<TresponseObjListObj[][]>([]); // двумерный массив, первый слой - дни, второй - погода на 3 - 9 - 15 - 21 часов
    const rawSortedWeather = useRef<TresponseObjListObj[][]>([]); // тотже массив что и выше но тут в каждом дне присутствуют все часы с интервалом в 3
    const [isLoadingVisible, setIsLoadingVisible] = useState<boolean>(false); // отображать-ли значек загрузки
    const [dataIdRender, setDataIdRender] = useState<string>(""); // dt идонтефикатор дня, который мы отображаем // строка "дд.мм.гг_отображаемого_дня--index_его_в_массиве"
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
    }, [refChartWrapper.current]);

    // после любого обновления компонента
    useEffect(() => {
        getWeather();
    });

    return (
        <div className="City5d3hWeather">
            {Weather && sorted_days_weather.length > 0 && !isLoadingVisible ? (
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
                        <div className="City5d3hWeather__chart_type_list">
                            <City5d3hWeather_chartTypeList chartDataType={chartDataType} setChartDataType={setChartDataType} />
                        </div>
                        <div className="City5d3hWeather__chart" ref={refChartWrapper}>
                            <City5d3hWeather_chart
                                rawSortedWeather={rawSortedWeather}
                                dataIdRender={dataIdRender}
                                chartDataType={chartDataType}
                            />
                        </div>
                    </div>
                </>
            ) : !isLoadingVisible ? (
                <div className="City5d3hWeather__default"></div>
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
