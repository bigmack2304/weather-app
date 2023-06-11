import React, { memo, useEffect } from "react";
import "./Home.scss";
import { deep_object_is_equal } from "../../utils/is_equal";
import { CityCurrentWeather } from "../../components/CityCurrentWeather/CityCurrentWeather";
import { City5d3hWeather } from "../../components/City5d3hWeather/City5d3hWeather";
import type { ICity5d3hWeatherProps } from "../../components/City5d3hWeather/City5d3hWeather";
import "./../../utils/chart_fix";
import "./../../global_styles/chart_fix.scss";
import { ErrorCacher } from "../../HOC/ErrorCacher/ErrorCacher";
import { HocOnResizeUpdate } from "../../HOC/OnResizeUpdate/OnResizeUpdate";
import { updatePageSelector } from "../../redux/slises/homePage";
import { useAppStoreDispatch } from "../../redux/redux_hooks";

const City5d3hWeather_onResizeUpdate = HocOnResizeUpdate<ICity5d3hWeatherProps>(City5d3hWeather); // City5d3hWeather нужно перерендоревать при ресайзе

interface IHomePageProps {}

type TProps = Readonly<IHomePageProps>;

function HomePage({}: TProps) {
    let stateWeatherGeoDispatch = useAppStoreDispatch();

    // при вервой загрузке обновляем  селектор этого компонента в сторе
    useEffect(() => {
        stateWeatherGeoDispatch(updatePageSelector("div[class*='Home']"));
        return () => {
            stateWeatherGeoDispatch(updatePageSelector(""));
        };
    }, []);

    return (
        <>
            <div className="Home">
                <div className="Home__in_container">
                    <section className="Home__weather_now">
                        <h3 className="visually_hidden">Погода на сегодня</h3>
                        <ErrorCacher>
                            <CityCurrentWeather />
                        </ErrorCacher>
                    </section>
                    <section className="Home__weather_week">
                        <h3 className="visually_hidden">Погода на 5 дней</h3>
                        <ErrorCacher>
                            <City5d3hWeather_onResizeUpdate />
                        </ErrorCacher>
                    </section>
                </div>
            </div>
        </>
    );
}

const HomePage_memo = memo(HomePage, deep_object_is_equal);

export { HomePage, HomePage_memo };
export type { IHomePageProps };
