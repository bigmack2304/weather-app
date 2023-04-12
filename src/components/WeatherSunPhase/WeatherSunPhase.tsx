import React, { useRef, useEffect } from "react";
import "./WeatherSunPhase.scss";
import { IconSunrise } from "../../ui/IconSunrise";
import { IconWeatherClearDay } from "../../ui/IconWeatherClearDay";
import { IconWeatherClearNight } from "../../ui/IconWeatherClearNight";
import type { TResponse } from "../../utils/fetch_current_weather";
import { calc_sun_hours_details, addon_map, get_text_date } from "../../utils/util_functions";

interface IWeatherSunPhaseProps {
    addClassName?: string[];
    cityTime: number;
    cityTimezone: number;
    sun_hours: ReturnType<typeof calc_sun_hours_details>;
}

type TProps = Readonly<IWeatherSunPhaseProps>;

function WeatherSunPhase({ addClassName = [""], sun_hours, cityTime, cityTimezone }: TProps) {
    const componentClassName = [...addClassName, "WeatherSunPhase"].join(" ");
    const fixed_timestamp = (cityTime + cityTimezone) * 1000;
    const refVieport = useRef<HTMLDivElement>(null);
    const refSunWrapper = useRef<HTMLDivElement>(null);
    const refG2 = useRef<HTMLDivElement>(null);

    // расчитывает необходимый размер блока перед иконкой солнышка, так чтобы эта иконка была
    // в указанном процентном соотношении относительно ширины вьюпорта компонента
    // на вход приходит число в процентах, насколько требуется смистить иконку
    const set_sun_offset = (needProcent: number) => {
        if (!refVieport.current || !refSunWrapper.current || !refG2.current) return;
        let fixed_procent = needProcent;
        if (fixed_procent < 0) fixed_procent = 0;
        if (fixed_procent > 100) fixed_procent = 100;

        const iconWidth = refSunWrapper.current.clientWidth;
        const vieportWidth = refVieport.current.clientWidth;

        //const calcPixels = ((vieportWidth - iconWidth) / 100) * fixed_procent; // расчетное смещение в пикселях
        const calcProcents = ((100 - iconWidth / (vieportWidth / 100)) / 100) * fixed_procent; // расчетное смещение в процентах

        refG2.current.style.width = `${calcProcents}%`;
    };

    // расчитываем нужное положение иконки на шкале, исходя из данных
    // о восходе и заходе
    const calc_sun_pos = () => {
        const sunrise = sun_hours.sunrise.timestamp;
        const sunset = sun_hours.sunset.timestamp;
        return addon_map(fixed_timestamp, sunrise, sunset, 0, 100);
    };

    const is_night = fixed_timestamp < sun_hours.sunrise.timestamp || fixed_timestamp > sun_hours.sunset.timestamp ? true : false;

    //
    const fixed_time_data = get_text_date(new Date(new Date(fixed_timestamp).setHours(new Date(fixed_timestamp).getUTCHours())));

    useEffect(() => {
        if (is_night) return;
        set_sun_offset(calc_sun_pos());
    });

    return (
        <div className={componentClassName}>
            <div className="WeatherSunPhase__sun_rise_wrapper">
                {!is_night ? (
                    <>
                        <IconSunrise sunrise={true} addClassName={["WeatherSunPhase__sun_rise_wrapper__icon"]} />
                        <span className="WeatherSunPhase__time">
                            {sun_hours.sunrise.hours}:{sun_hours.sunrise.minutes}
                        </span>
                    </>
                ) : (
                    <>
                        <IconWeatherClearNight addClassName={["WeatherSunPhase__sun_rise_wrapper__icon"]} />
                        <span className="WeatherSunPhase__time">
                            {fixed_time_data.hours}:{fixed_time_data.minutes}
                        </span>
                    </>
                )}
            </div>
            <div className="WeatherSunPhase__vieport" ref={refVieport}>
                {!is_night ? (
                    <>
                        <div className="WeatherSunPhase__g1"></div>
                        <div className="WeatherSunPhase__g2" ref={refG2}></div>
                        <div className="WeatherSunPhase__sun_wrapper" ref={refSunWrapper}>
                            <IconWeatherClearDay />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="WeatherSunPhase__g1"></div>
                    </>
                )}
            </div>
            <div className="WeatherSunPhase__sun_set_wrapper">
                {!is_night ? (
                    <>
                        <IconSunrise sunrise={false} addClassName={["WeatherSunPhase__sun_set_wrapper__icon"]} />
                        <span className="WeatherSunPhase__time">
                            {sun_hours.sunset.hours}:{sun_hours.sunset.minutes}
                        </span>
                    </>
                ) : (
                    <>
                        <IconSunrise sunrise={true} addClassName={["WeatherSunPhase__sun_rise_wrapper__icon"]} />
                        <span className="WeatherSunPhase__time">
                            {sun_hours.sunrise.hours}:{sun_hours.sunrise.minutes}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

export { WeatherSunPhase };