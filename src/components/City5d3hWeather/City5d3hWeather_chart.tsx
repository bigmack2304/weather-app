import React from "react";
import "./City5d3hWeather.scss";
import { ChartTypeOne } from "../ChartTypeOne/ChartTypeOne";
import { decode_dataIdRender } from "./City5d3hWeather";
import type { TresponseObjListObj, TresponseObj } from "../../utils/fetch_5d3h_weather";
import { get_text_date } from "../../utils/util_functions";

type TCity5d3hWeather_chartProps = {
    rawSortedWeather: React.MutableRefObject<TresponseObjListObj[][]>;
    dataIdRender: string;
    chartDataType: string;
};

type TProps = Readonly<TCity5d3hWeather_chartProps>;

function City5d3hWeather_chart({ rawSortedWeather, dataIdRender, chartDataType }: TProps) {
    const getChartData = (val: string, day: TresponseObjListObj) => {
        let result = 0;

        switch (val) {
            case "Температура":
                result = day.main.temp;
                break;

            case "Осадки":
                if (day.rain) {
                    result = day.rain["3h"];
                }

                if (day.snow) {
                    result = day.snow["3h"];
                }
                break;

            default:
                break;
        }

        return result;
    };

    const units_of_measurement = (val: string) => {
        let result = "";

        switch (val) {
            case "Температура":
                result = "°c";
                break;

            case "Осадки":
                result = "мм/3ч";
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
                    [chartDataType]: getChartData(chartDataType, day),
                };
            })}
            pointsData={[{ pointName: chartDataType, pointGradientCloror: "#f0f8ff", pointLineCloror: "#d33d29" }]}
            toolTipPostfix={units_of_measurement(chartDataType)}
        />
    );
}

export { City5d3hWeather_chart };
