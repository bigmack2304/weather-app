import React from "react";
import "./IconWeatherCloudyDay.scss";
import { is_device_mobile } from "../utils/util_functions";

interface IIconWeatherCloudyDayProps {
    addClassName?: string[];
}

type TProps = Readonly<IIconWeatherCloudyDayProps>;

function IconWeatherCloudyDay({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconWeatherCloudyDay"].join(" ");
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 61.7 42.8"
            className={componentClassName}
            xmlSpace="preserve"
        >
            <g>
                <g>
                    <path
                        className="IconWeatherCloudyDay__white"
                        d="M47.2,42.8H7.9c-4.3,0-7.9-3.5-7.9-7.9l0,0C0,30.5,3.5,27,7.9,27h39.4c4.3,0,7.9,3.5,7.9,7.9 v0C55.1,39.2,51.6,42.8,47.2,42.8z"
                    ></path>
                    <circle className="IconWeatherCloudyDay__white" cx="17.4" cy="25.5" r="9.3"></circle>
                    <circle className="IconWeatherCloudyDay__white" cx="34.5" cy="23.9" r="15.6"></circle>
                    {!is_device_mobile() ? (
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
                    ) : null}
                </g>
                <g>
                    <circle className="IconWeatherCloudyDay__yellow" cx="31.4" cy="18.5" r="9"></circle>
                    <g>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M31.4,6.6L31.4,6.6c-0.4,0-0.6-0.3-0.6-0.6V0.6C30.8,0.3,31,0,31.3,0l0.1,0 C31.7,0,32,0.3,32,0.6v5.5C32,6.4,31.7,6.6,31.4,6.6z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M31.4,30.1L31.4,30.1c-0.4,0-0.6,0.3-0.6,0.6v5.5c0,0.3,0.3,0.6,0.6,0.6h0.1 c0.3,0,0.6-0.3,0.6-0.6v-5.5C32,30.4,31.7,30.1,31.4,30.1z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M19.6,18.3L19.6,18.3c0,0.4-0.3,0.6-0.6,0.6h-5.5c-0.3,0-0.6-0.3-0.6-0.6v-0.1 c0-0.3,0.3-0.6,0.6-0.6H19C19.3,17.8,19.6,18,19.6,18.3z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M43.1,18.3L43.1,18.3c0,0.4,0.3,0.6,0.6,0.6h5.5c0.3,0,0.6-0.3,0.6-0.6v-0.1 c0-0.3-0.3-0.6-0.6-0.6h-5.5C43.4,17.8,43.1,18,43.1,18.3z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M22.4,26L22.4,26c0.3,0.3,0.2,0.7,0,0.9l-4.2,3.6c-0.2,0.2-0.6,0.2-0.8-0.1l-0.1-0.1 c-0.2-0.2-0.2-0.6,0.1-0.8l4.2-3.6C21.9,25.8,22.2,25.8,22.4,26z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M40.3,10.7L40.3,10.7c0.3,0.3,0.6,0.3,0.8,0.1l4.2-3.6c0.2-0.2,0.3-0.6,0.1-0.8l-0.1-0.1 c-0.2-0.2-0.6-0.3-0.8-0.1l-4.2,3.6C40.1,10.1,40,10.5,40.3,10.7z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M22.4,10.8L22.4,10.8c0.3-0.3,0.2-0.7,0-0.9l-4.2-3.6c-0.2-0.2-0.6-0.2-0.8,0.1l-0.1,0.1 c-0.2,0.2-0.2,0.6,0.1,0.8l4.2,3.6C21.9,11,22.2,11,22.4,10.8z"
                        ></path>
                        <path
                            className="IconWeatherCloudyDay__yellow"
                            d="M40.3,26.1L40.3,26.1c0.3-0.3,0.6-0.3,0.8-0.1l4.2,3.6c0.2,0.2,0.3,0.6,0.1,0.8l-0.1,0.1 c-0.2,0.2-0.6,0.3-0.8,0.1l-4.2-3.6C40.1,26.7,40,26.3,40.3,26.1z"
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
                {!is_device_mobile() ? (
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        dur="2s"
                        keyTimes="0;1"
                        repeatCount="indefinite"
                        type="scale"
                        values="1;1"
                        calcMode="linear"
                    ></animateTransform>
                ) : null}
            </g>
            <g>
                <path
                    className="IconWeatherCloudyDay__gray"
                    d="M55.7,25.1H34.4c-3.3,0-6-2.7-6-6v0c0-3.3,2.7-6,6-6h21.3c3.3,0,6,2.7,6,6v0 C61.7,22.4,59,25.1,55.7,25.1z"
                ></path>
                <circle className="IconWeatherCloudyDay__gray" cx="46.7" cy="13.4" r="10.7"></circle>
                {!is_device_mobile() ? (
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
                ) : null}
            </g>
        </svg>
    );
}

export { IconWeatherCloudyDay };
