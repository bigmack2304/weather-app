import React, { useRef, useEffect } from "react";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { first_caller_delay_callback } from "../../utils/decorators";
import { generateHashCode } from "../../utils/util_functions";
import "./CustomizedTooltip.scss";

interface ICustomizedTooltipProps {
    chartId: string; // id самого внешнего контейнера в компонекнте графика
}

type TProps = TooltipProps<ValueType, NameType> & ICustomizedTooltipProps;

function CustomizedTooltip(external: TProps) {
    let isActive = external.active!;
    let timerId: number | null = null;
    let refTooltip = useRef<HTMLDivElement>(null);
    let data = external.payload && external.payload.length > 0 ? external.payload[0] : null;

    // скрывает всплывающее окно. (если оно открыто то генерирует на графике событие узода мыши, это и приводит к закрытию)
    const toolTipHide = first_caller_delay_callback(
        () => {
            if (!isActive) return;
            let chart = document.querySelector(`[id="${external.chartId}"]`);
            if (!chart) return;
            let tooltip = chart.querySelector(`.recharts-tooltip-wrapper`);
            if (!tooltip) return;
            tooltip.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
        },
        () => {},
        200
    );

    useEffect(() => {
        timerId = setTimeout(() => {
            if (isActive) {
                toolTipHide();
                timerId = null;
            }
        }, 6000) as any as number;

        window.addEventListener("resize", toolTipHide);
        window.addEventListener("scroll", toolTipHide);

        return () => {
            window.removeEventListener("resize", toolTipHide);
            window.removeEventListener("scroll", toolTipHide);

            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        };
    }, [external]);

    const get_jsx_from_payload = () => {
        let jsx_arr: JSX.Element[] = [];
        let postfix: string = "";

        if (!data || !data.payload) return <></>;

        for (let elem in data.payload) {
            postfix = "";
            if (elem == "name") continue;
            if (elem.toLocaleLowerCase() == "температура") {
                postfix = "°c";
            }
            if (elem.toLocaleLowerCase() == "ощущается как") {
                postfix = "°c";
            }
            if (elem.toLocaleLowerCase() == "осадки") {
                postfix = "мм/3ч";
            }
            if (elem.toLocaleLowerCase() == "вер.осадков") {
                postfix = "%";
            }
            if (elem.toLocaleLowerCase() == "облачность") {
                postfix = "%";
            }
            if (elem.toLocaleLowerCase() == "видимость") {
                postfix = "Км";
            }

            let content: string = `${elem}: ${data.payload[elem]} ${postfix}`;
            let new_item = (
                <span className="CustomizedTooltip__item" key={generateHashCode(content)}>
                    {content}
                </span>
            );

            jsx_arr = [...jsx_arr, new_item];
        }

        return jsx_arr;
    };

    return (
        <div ref={refTooltip} className="CustomizedTooltip_wrapper">
            {data ? (
                <>
                    <p>{data.payload.name}</p>
                    {get_jsx_from_payload()}
                </>
            ) : null}
        </div>
    );
}

export { CustomizedTooltip };
