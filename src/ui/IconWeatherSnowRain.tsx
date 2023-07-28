import React from "react";
import "./IconWeatherSnowRain.scss";
import { is_device_mobile } from "../utils/util_functions";

interface IIconWeatherSnowRainProps {
    addClassName?: string[];
}

type TProps = Readonly<IIconWeatherSnowRainProps>;

function IconWeatherSnowRain({ addClassName = [""] }: TProps) {
    let componentclassName = [...addClassName, "IconWeatherSnowRain"].join(" ");
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 55.1 52.5"
            className={componentclassName}
            xmlSpace="preserve"
        >
            <g>
                <g>
                    <path
                        className="IconWeatherSnowRain__white"
                        d="M47.2,34.5H7.9c-4.3,0-7.9-3.5-7.9-7.9l0,0c0-4.3,3.5-7.9,7.9-7.9h39.4c4.3,0,7.9,3.5,7.9,7.9 v0C55.1,30.9,51.6,34.5,47.2,34.5z"
                    ></path>
                    <circle className="IconWeatherSnowRain__white" cx="17.4" cy="17.3" r="9.3"></circle>
                    <circle className="IconWeatherSnowRain__white" cx="34.5" cy="15.6" r="15.6"></circle>
                </g>
                <circle className="IconWeatherSnowRain__snow" cx="37" cy="43.5" r="3">
                    {!is_device_mobile() ? (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            dur="1.5s"
                            keyTimes="0;0.33;0.66;1"
                            repeatCount="indefinite"
                            type="translate"
                            values="-4 -2;-2 2; -2 4; -3 6"
                            calcMode="linear"
                        ></animateTransform>
                    ) : null}
                </circle>
                <g>
                    <path
                        className="IconWeatherSnowRain__rain"
                        d="M36.3,51.9c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1c0-1.7,3.1-7.8,3.1-7.8 S36.3,50.2,36.3,51.9z"
                    ></path>
                    {!is_device_mobile() ? (
                        <>
                            <animateTransform
                                attributeName="transform"
                                attributeType="XML"
                                dur="1s"
                                keyTimes="0;1"
                                repeatCount="indefinite"
                                type="translate"
                                values="-12 -5;-12 5"
                                calcMode="linear"
                            ></animateTransform>
                            <animate
                                attributeType="CSS"
                                attributeName="opacity"
                                dur="1s"
                                keyTimes="0;1"
                                repeatCount="indefinite"
                                values="1;0"
                                calcMode="linear"
                            ></animate>
                        </>
                    ) : null}
                </g>
            </g>
        </svg>
    );
}

export { IconWeatherSnowRain };
