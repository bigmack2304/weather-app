import React from "react";
import { WeatherAltInfoTemplate } from "../WeatherAltInfoTemplate/WeatherAltInfoTemplate";
import "./City5d3hWeather.scss";

type TCity5d3hWeather_chartTypeListProps = {
    chartDataType: string;
    setChartDataType: (val: string) => void;
};

type TProps = Readonly<TCity5d3hWeather_chartTypeListProps>;

function City5d3hWeather_chartTypeList({ chartDataType, setChartDataType }: TProps) {
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
                addClassName={[chartDataType == "Температура" ? "City5d3hWeather__day--active" : "", "City5d3hWeather__chart_type_item"]}
            />
            <WeatherAltInfoTemplate
                slot_header="Осадки"
                data_id={"Осадки"}
                onClick={onClickRainfall}
                addClassName={[chartDataType == "Осадки" ? "City5d3hWeather__day--active" : "", "City5d3hWeather__chart_type_item"]}
            />
        </>
    );
}

export { City5d3hWeather_chartTypeList };
