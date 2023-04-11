import React from "react";
import "./IconSunrise.scss";

// иконка для восхода\захода солнца, sunrise=true восход,  sunrise=false заход

interface IIconSunriseProps {
    addClassName?: string[];
    sunrise: boolean;
}

type TProps = Readonly<IIconSunriseProps>;

function IconSunrise({ addClassName = [""], sunrise }: TProps) {
    let componentClassName = [...addClassName, "IconSunrise"].join(" ");
    return (
        <svg className={componentClassName} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path className="IconSunrise__sun" d="M15,36a17,17,0,0,1,34,0" />
            <line className="IconSunrise__sun_r" x1="32" x2="32" y1="9" y2="15" />
            <line className="IconSunrise__sun_r" x1="59" x2="53" y1="36" y2="36" />
            <line className="IconSunrise__sun_r" x1="11" x2="5" y1="36" y2="36" />
            <line className="IconSunrise__sun_r" x1="51.09" x2="46.85" y1="16.91" y2="21.15" />
            <line className="IconSunrise__sun_r" x1="17.15" x2="12.91" y1="21.15" y2="16.91" />
            <line className="IconSunrise__horizon" x1="5.5" x2="58.5" y1="37.5" y2="37.5" />
            <line className="IconSunrise__horizon" x1="41.5" x2="54.5" y1="43.5" y2="43.5" />
            <line className="IconSunrise__horizon" x1="9.5" x2="22.5" y1="43.5" y2="43.5" />
            <line className={`IconSunrise__arrow ${sunrise ? "" : "IconSunrise--invert"}`} x1="32" x2="32" y1="55.74" y2="43.74" />
            <polyline className={`IconSunrise__arrow ${sunrise ? "" : "IconSunrise--invert"}`} points="36.24 47.24 32 43 27.76 47.24" />
        </svg>
    );
}

export { IconSunrise };
