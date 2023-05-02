import React, { useRef, useEffect } from "react";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { first_caller_delay_callback } from "../../utils/decorators";
import "./CustomizedTooltip.scss";

function CustomizedTooltip(external: TooltipProps<ValueType, NameType>) {
    let isActive = external.active!;
    let timerId: number | null = null;
    let refTooltip = useRef<HTMLDivElement>(null);
    let data = external.payload![0];

    const toolTipHide = first_caller_delay_callback(
        () => {
            document.querySelector(".recharts-tooltip-wrapper")!.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
            // refTooltip.current!.style.display = "none";
        },
        () => {},
        200
    );

    useEffect(() => {
        //   refTooltip.current!.style.display = "block";
    });

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
            // refTooltip.current!.style.display = "block";
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
                    <span>{`${data.dataKey}: ${data.payload[data.dataKey!]} °c`}</span>
                </>
            ) : null}
        </div>
    );
}

export { CustomizedTooltip };
