import React from "react";
import "./IconWeatherSnow_2.scss";
import { is_device_mobile } from "../utils/util_functions";

interface IIconWeatherSnow_2Props {
    addClassName?: string[];
}

type TProps = Readonly<IIconWeatherSnow_2Props>;

function IconWeatherSnow_2({ addClassName = [""] }: TProps) {
    let componentclassName = [...addClassName, "IconWeatherSnow_2"].join(" ");
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
                        className="IconWeatherSnow_2__white"
                        d="M47.2,34.5H7.9c-4.3,0-7.9-3.5-7.9-7.9l0,0c0-4.3,3.5-7.9,7.9-7.9h39.4c4.3,0,7.9,3.5,7.9,7.9 v0C55.1,30.9,51.6,34.5,47.2,34.5z"
                    ></path>
                    <circle className="IconWeatherSnow_2__white" cx="17.4" cy="17.3" r="9.3"></circle>
                    <circle className="IconWeatherSnow_2__white" cx="34.5" cy="15.6" r="15.6"></circle>
                </g>
                <circle className="IconWeatherSnow_2__snow" cx="37" cy="43.5" r="3">
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
                <circle className="IconWeatherSnow_2__snow" cx="27" cy="43.5" r="3">
                    {!is_device_mobile() ? (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            dur="1.5s"
                            keyTimes="0;0.33;0.66;1"
                            repeatCount="indefinite"
                            type="translate"
                            values="-4 -2;-2 2; -4 4; -3 6"
                            calcMode="linear"
                        ></animateTransform>
                    ) : null}
                </circle>
            </g>
        </svg>
    );
}

export { IconWeatherSnow_2 };
