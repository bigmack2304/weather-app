import React from "react";
import "./WeatherAltInfoTemplate.scss";

// будем показывать количество осадков если они есть.

interface IWeatherAltInfoTemplateProps {
    addClassName?: string[];
    newClassName?: string;
    slot_header?: React.ReactNode;
    slot_main?: React.ReactNode;
    slot_dop?: React.ReactNode;
    onClick?: (event: React.MouseEvent, data_id: string) => void;
    data_id?: string;
}

type TProps = Readonly<IWeatherAltInfoTemplateProps>;

function WeatherAltInfoTemplate({
    addClassName = [""],
    newClassName,
    slot_header,
    slot_main,
    slot_dop,
    onClick = () => {},
    data_id = "",
}: TProps) {
    const componentClassName = newClassName ?? [...addClassName, "WeatherAltInfoTemplate"].join(" ");

    const componentOnClick = (e: React.MouseEvent) => {
        onClick(e, data_id);
    };

    return (
        <div className={componentClassName} onClick={componentOnClick}>
            {slot_header ? <p className="WeatherAltInfoTemplate__head">{slot_header}</p> : null}

            {slot_main || slot_dop ? (
                <div className="WeatherAltInfoTemplate__content_wrapper">
                    {slot_main ? <div className="WeatherAltInfoTemplate__content_main">{slot_main}</div> : null}
                    {slot_dop ? <div className="WeatherAltInfoTemplate__content_dop">{slot_dop}</div> : null}
                </div>
            ) : null}
        </div>
    );
}

export { WeatherAltInfoTemplate };
