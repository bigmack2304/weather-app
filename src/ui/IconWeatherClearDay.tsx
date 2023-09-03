import React from "react";
import "./IconWeatherClearDay.scss";
import { is_device_mobile } from "../utils/util_functions";

interface IIconWeatherClearDayProps {
    addClassName?: string[];
}

type TProps = Readonly<IIconWeatherClearDayProps>;

function IconWeatherClearDay({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconWeatherClearDay"].join(" ");
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 44.9 44.9"
            xmlSpace="preserve"
            className={componentClassName}
        >
            <g>
                <circle className="IconWeatherClearDay__yellow" cx="22.4" cy="22.6" r="11"></circle>
                <g>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M22.6,8.1h-0.3c-0.3,0-0.6-0.3-0.6-0.6v-7c0-0.3,0.3-0.6,0.6-0.6l0.3,0c0.3,0,0.6,0.3,0.6,0.6 v7C23.2,7.8,22.9,8.1,22.6,8.1z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M22.6,36.8h-0.3c-0.3,0-0.6,0.3-0.6,0.6v7c0,0.3,0.3,0.6,0.6,0.6h0.3c0.3,0,0.6-0.3,0.6-0.6v-7 C23.2,37,22.9,36.8,22.6,36.8z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M8.1,22.3v0.3c0,0.3-0.3,0.6-0.6,0.6h-7c-0.3,0-0.6-0.3-0.6-0.6l0-0.3c0-0.3,0.3-0.6,0.6-0.6h7 C7.8,21.7,8.1,21.9,8.1,22.3z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M36.8,22.3v0.3c0,0.3,0.3,0.6,0.6,0.6h7c0.3,0,0.6-0.3,0.6-0.6v-0.3c0-0.3-0.3-0.6-0.6-0.6h-7 C37,21.7,36.8,21.9,36.8,22.3z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M11.4,31.6l0.2,0.3c0.2,0.2,0.2,0.6-0.1,0.8l-5.3,4.5c-0.2,0.2-0.6,0.2-0.8-0.1l-0.2-0.3 c-0.2-0.2-0.2-0.6,0.1-0.8l5.3-4.5C10.9,31.4,11.2,31.4,11.4,31.6z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M33.2,13l0.2,0.3c0.2,0.2,0.6,0.3,0.8,0.1l5.3-4.5c0.2-0.2,0.3-0.6,0.1-0.8l-0.2-0.3 c-0.2-0.2-0.6-0.3-0.8-0.1l-5.3,4.5C33,12.4,33,12.7,33.2,13z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M11.4,13.2l0.2-0.3c0.2-0.2,0.2-0.6-0.1-0.8L6.3,7.6C6.1,7.4,5.7,7.5,5.5,7.7L5.3,7.9 C5.1,8.2,5.1,8.5,5.4,8.7l5.3,4.5C10.9,13.5,11.2,13.5,11.4,13.2z"
                    ></path>
                    <path
                        className="IconWeatherClearDay__yellow"
                        d="M33.2,31.9l0.2-0.3c0.2-0.2,0.6-0.3,0.8-0.1l5.3,4.5c0.2,0.2,0.3,0.6,0.1,0.8l-0.2,0.3 c-0.2,0.2-0.6,0.3-0.8,0.1l-5.3-4.5C33,32.5,33,32.1,33.2,31.9z"
                    ></path>
                    {!is_device_mobile() ? (
                        <animate
                            attributeType="CSS"
                            attributeName="opacity"
                            dur="0.5s"
                            keyTimes="0;0.5;1"
                            repeatCount="indefinite"
                            values="1;0.6;1"
                            calcMode="linear"
                        ></animate>
                    ) : null}
                </g>
            </g>
        </svg>
    );
}

export { IconWeatherClearDay };
