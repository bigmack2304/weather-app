import React, { useRef, useEffect } from "react";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { first_caller_delay_callback } from "../../utils/decorators";
import "./CustomizedTooltip.scss";

interface ICustomizedTooltipProps {
    toolTipPostfix?: string;
}

type TProps = TooltipProps<ValueType, NameType> & ICustomizedTooltipProps;

function CustomizedTooltip(external: TProps) {
    let isActive = external.active!;
    let timerId: number | null = null;
    let refTooltip = useRef<HTMLDivElement>(null);
    //let data = external.payload![0];
    let data = external.payload && external.payload.length > 0 ? external.payload[0] : null;

    const toolTipHide = first_caller_delay_callback(
        () => {
            if (!isActive) return;
            let tooltip = document.querySelector(".recharts-tooltip-wrapper");
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

    return (
        <div ref={refTooltip} className="CustomizedTooltip_wrapper">
            {data ? (
                <>
                    <p>{data.payload.name}</p>
                    <span>{`${data.dataKey}: ${data.payload[data.dataKey!]} ${
                        external.toolTipPostfix && external.toolTipPostfix !== "" ? external.toolTipPostfix : ""
                    }`}</span>
                </>
            ) : null}
        </div>
    );
}

export { CustomizedTooltip };
