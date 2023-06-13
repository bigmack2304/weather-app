import React from "react";
import "./IconWeatherRain_2.scss";

interface IIconWeatherRain_2Props {
    addClassName?: string[];
}

type TProps = Readonly<IIconWeatherRain_2Props>;

function IconWeatherRain_2({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconWeatherRain_2"].join(" ");
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 60.7 60"
            className={componentClassName}
            xmlSpace="preserve"
        >
            <g>
                <g>
                    <path
                        className="IconWeatherRain_2__white"
                        d="M47.2,40H7.9C3.5,40,0,36.5,0,32.1l0,0c0-4.3,3.5-7.9,7.9-7.9h39.4c4.3,0,7.9,3.5,7.9,7.9v0 C55.1,36.5,51.6,40,47.2,40z"
                    ></path>
                    <circle className="IconWeatherRain_2__white" cx="17.4" cy="22.8" r="9.3"></circle>
                    <circle className="IconWeatherRain_2__white" cx="34.5" cy="21.1" r="15.6"></circle>
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        dur="6s"
                        keyTimes="0;0.5;1"
                        repeatCount="indefinite"
                        type="translate"
                        values="0;5;0"
                        calcMode="linear"
                    ></animateTransform>
                </g>
                <g>
                    <path
                        className="IconWeatherRain_2__gray"
                        d="M54.7,22.3H33.4c-3.3,0-6-2.7-6-6v0c0-3.3,2.7-6,6-6h21.3c3.3,0,6,2.7,6,6v0 C60.7,19.6,58,22.3,54.7,22.3z"
                    ></path>
                    <circle className="IconWeatherRain_2__gray" cx="45.7" cy="10.7" r="10.7"></circle>
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        dur="6s"
                        keyTimes="0;0.5;1"
                        repeatCount="indefinite"
                        type="translate"
                        values="0;-3;0"
                        calcMode="linear"
                    ></animateTransform>
                </g>
                <g>
                    <path
                        className="IconWeatherRain_2__rain"
                        d="M26.4,51.9c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1c0-1.7,3.1-7.8,3.1-7.8 S26.4,50.2,26.4,51.9z"
                    ></path>
                    <path
                        className="IconWeatherRain_2__rain"
                        d="M36.3,51.9c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1c0-1.7,3.1-7.8,3.1-7.8 S36.3,50.2,36.3,51.9z"
                    ></path>
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        dur="1s"
                        keyTimes="0;1"
                        repeatCount="indefinite"
                        type="translate"
                        values="2 0;2 10"
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
                </g>
            </g>
        </svg>
    );
}

export { IconWeatherRain_2 };