import React, { useRef, useEffect } from "react";
import { useHandleUpdate } from "../../hooks/useHandleUpdate";
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer } from "recharts";

type IChartDot = {
    name: string; // имя раздела на графике к которому будет принадлежать точка
    [pointName_value: string]: any; // ключем является имя точки, которое должно присутствовать в TChartTypeOneProps. ...pointsData.pointName, значение поля это значение на графике
};

// обьект м имянем точки и ее цветами, которая будет использоватся в графике
type TPointData = {
    pointName: string;
    pointLineCloror: string;
    pointGradientCloror: string;
};

type TChartTypeOneProps = {
    chartData: IChartDot[];
    pointsData: TPointData[];
};

type TProps = Readonly<TChartTypeOneProps>;

type TChartSizes = {
    h: number;
    w: number;
};

function ChartTypeOne({ chartData, pointsData }: TProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const chartSizes = useRef<TChartSizes>({ w: 0, h: 0 });
    const [handleUpdate] = useHandleUpdate();

    const chart_update_size = () => {
        const sizes = wrapperRef.current?.getBoundingClientRect();
        chartSizes.current.h = sizes!.height;
        chartSizes.current.w = sizes!.width;
        // debugger;
        // handleUpdate();
    };

    useEffect(() => {
        if (!wrapperRef.current) return;
        //chart_update_size();
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
            <AreaChart
                margin={{ top: 0, left: -30, right: 0, bottom: 0 }}
                data={chartData}
                width={chartSizes.current.w}
                height={chartSizes.current.h}
            >
                <defs>
                    {pointsData.map((point) => {
                        return (
                            <React.Fragment key={point.pointName}>
                                <linearGradient id={`color${point.pointName}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={point.pointGradientCloror} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={point.pointGradientCloror} stopOpacity={0.2} />
                                </linearGradient>
                            </React.Fragment>
                        );
                    })}
                </defs>
                {pointsData.map((point) => {
                    return (
                        <React.Fragment key={point.pointName}>
                            <Area
                                type="monotone"
                                dataKey={point.pointName}
                                stroke={point.pointLineCloror}
                                fillOpacity={1}
                                fill={`url(#color${point.pointName})`}
                            />
                        </React.Fragment>
                    );
                })}
                <XAxis dataKey={"name"} />
                <YAxis />
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip active={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export { ChartTypeOne };
