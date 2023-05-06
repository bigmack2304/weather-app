import React from "react";
import "./IconWeatherClearNight.scss";

interface IIconWeatherClearNightProps {
    addClassName?: string[];
}

type TProps = Readonly<IIconWeatherClearNightProps>;

function IconWeatherClearNight({ addClassName = [""] }: TProps) {
    let componentClassName = [...addClassName, "IconWeatherClearNight"].join(" ");
    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 30.8 42.5"
            xmlSpace="preserve"
            className={componentClassName}
        >
            <path
                id="Moon"
                className="IconWeatherClearNight__yellow"
                d="M15.3,21.4C15,12.1,21.1,4.2,29.7,1.7c-2.8-1.2-5.8-1.8-9.1-1.7C8.9,0.4-0.3,10.1,0,21.9 c0.3,11.7,10.1,20.9,21.9,20.6c3.2-0.1,6.3-0.9,8.9-2.3C22.2,38.3,15.6,30.7,15.3,21.4z"
            ></path>
        </svg>
    );
}

export { IconWeatherClearNight };
