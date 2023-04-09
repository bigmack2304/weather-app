import React from "react";
import "./WeatherAltInfoWnd.scss";
import { IconDirection } from "../../ui/IconDirection";
import type { TResponse } from "../../utils/fetch_current_weather";

// будем показывать количество осадков если они есть.

interface IWeatherAltInfoWndProps {
    addClassName?: string[];
    weather: TResponse;
}

type TProps = Readonly<IWeatherAltInfoWndProps>;

function WeatherAltInfoWnd({ addClassName = [""], weather }: TProps) {
    const componentClassName = [...addClassName, "WeatherAltInfoWnd"].join(" ");
    const is_wind = weather && weather.wind ? true : false;

    return (
        <>
            {weather && is_wind ? (
                <div className={componentClassName}>
                    <p className="WeatherAltInfoWnd__desc">Ветер</p>
                    <div className="WeatherAltInfoWnd__wnd_wrapper">
                        <IconDirection direction={weather.wind!.deg} />
                        <span className="WeatherAltInfoWnd__value">{`${weather.wind!.speed}`} m/сек</span>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export { WeatherAltInfoWnd };
