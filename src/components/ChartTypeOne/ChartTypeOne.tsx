import React from "react";
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer } from "recharts";
import { CustomizedTooltip } from "../CustomizedTooltip/CustomizedTooltip";

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
    chartAnimation?: boolean;
};

type TProps = Readonly<TChartTypeOneProps>;

function ChartTypeOne({ chartData, pointsData, chartAnimation = true }: TProps) {
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
            <AreaChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }} data={chartData}>
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
                                isAnimationActive={chartAnimation}
                            />
                        </React.Fragment>
                    );
                })}
                <XAxis dataKey={(chartData) => chartData.name} interval={"preserveStart"} />
                <YAxis width={50} interval={"preserveStart"} />
                <CartesianGrid strokeDasharray="5 5" />
                <Tooltip active={false} isAnimationActive={false} content={<CustomizedTooltip />} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export { ChartTypeOne };
