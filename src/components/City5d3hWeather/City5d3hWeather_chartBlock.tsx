import React, { useState, useRef, useEffect } from "react";
import { City5d3hWeather_chart } from "./City5d3hWeather_chart";
import { City5d3hWeather_chartTypeList } from "./City5d3hWeather_chartTypeList";
import type { TresponseObjListObj } from "../../utils/fetch_5d3h_weather";

type TCity5d3hWeather_chartBlockProps = {
    rawSortedWeather: React.MutableRefObject<TresponseObjListObj[][]>;
    dataIdRender: string;
};

type TProps = Readonly<TCity5d3hWeather_chartBlockProps>;

function City5d3hWeather_chartBlock({ rawSortedWeather, dataIdRender }: TProps) {
    const [chartDataType, setChartDataType] = useState<string>("Температура"); // dt идонтефикатор дня, который мы отображаем
    const refChartWrapper = useRef<HTMLDivElement>(null); // ссылка на DOM контейнер для графика

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

    return (
        <>
            <div className="City5d3hWeather__chart_type_list">
                <City5d3hWeather_chartTypeList chartDataType={chartDataType} setChartDataType={setChartDataType} />
            </div>
            <div className="City5d3hWeather__chart" ref={refChartWrapper}>
                <City5d3hWeather_chart rawSortedWeather={rawSortedWeather} dataIdRender={dataIdRender} chartDataType={chartDataType} />
            </div>
        </>
    );
}

export { City5d3hWeather_chartBlock };
