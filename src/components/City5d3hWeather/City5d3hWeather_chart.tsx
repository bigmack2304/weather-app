import React from "react";
import "./City5d3hWeather.scss";
import { ChartTypeOne } from "../ChartTypeOne/ChartTypeOne";
import { decode_dataIdRender } from "./City5d3hWeather";
import type { TresponseObjListObj, TresponseObj } from "../../utils/fetch_5d3h_weather";
import { get_text_date } from "../../utils/util_functions";
import { addon_map } from "../../utils/util_functions";

type TCity5d3hWeather_chartProps = {
    rawSortedWeather: React.MutableRefObject<TresponseObjListObj[][]>;
    dataIdRender: string;
    chartDataType: string;
};

type TProps = Readonly<TCity5d3hWeather_chartProps>;

function City5d3hWeather_chart({ rawSortedWeather, dataIdRender, chartDataType }: TProps) {
    const getChartData = (val: string, day: TresponseObjListObj) => {
        let result: object = {};

        switch (val) {
            case "Температура":
                result = {
                    Температура: day.main.temp,
                    ["Ощущается как"]: day.main.feels_like,
                };
                break;

            case "Осадки":
                result = {
                    Осадки: 0,
                };

                if (day.rain) {
                    result = { ...result, Осадки: day.rain["3h"] };
                }

                if (day.snow) {
                    result = { ...result, Осадки: day.snow["3h"] };
                }

                result = {
                    ...result,
                    ["Вер.осадков"]: addon_map(day.pop, 0.0, 1.0, 0, 100).toFixed(0),
                };

                break;

            default:
                break;
        }

        return result;
    };

    return (
        <ChartTypeOne
            chartData={rawSortedWeather.current[Number(decode_dataIdRender(dataIdRender).index)].map((day) => {
                let text_date = get_text_date(day.dt * 1000);
                return {
                    name: `${text_date.hoursUTC}:${text_date.minutesUTC}`,
                    // [chartDataType]: getChartData(chartDataType, day),
                    ...getChartData(chartDataType, day),
                };
            })}
            pointsData={[{ pointName: chartDataType, pointGradientCloror: "#f0f8ff", pointLineCloror: "#d33d29" }]}
        />
    );
}

export { City5d3hWeather_chart };
