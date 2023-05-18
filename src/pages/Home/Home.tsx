import React, { memo, useState, useContext, useEffect, useRef } from "react";
import "./Home.scss";
import { deep_object_is_equal } from "../../utils/is_equal";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { CityCurrentWeather } from "../../components/CityCurrentWeather/CityCurrentWeather";
import { City5d3hWeather } from "../../components/City5d3hWeather/City5d3hWeather";
import type { ICity5d3hWeatherProps } from "../../components/City5d3hWeather/City5d3hWeather";
import { update_meta_title, unshuft_unique_obj_to_array_force, update_meta_desc } from "../../utils/util_functions";
import { useLoacalStorage } from "../../hooks/useLocalStorage";
import { useHashAddressBar } from "../../hooks/useHashAddressBar";
import { PortalVieport } from "../../components/PortalVieport/PortalVieport";
import "./../../utils/chart_fix";
import "./../../global_styles/chart_fix.scss";
import { ErrorCacher } from "../../HOC/ErrorCacher/ErrorCacher";
import { HocOnResizeUpdate } from "../../HOC/OnResizeUpdate/OnResizeUpdate";
import type { TStorageHistoryCity } from "../../appLocalStorage/appLoacalStorage";

import { updateCity } from "../../redux/slises/weather_lat_lon";
import { updatePageRef } from "../../redux/slises/homePage";
import { useAppStoreDispatch, useAppStoreSelector } from "../../redux/redux_hooks";

const City5d3hWeather_onResizeUpdate = HocOnResizeUpdate<ICity5d3hWeatherProps>(City5d3hWeather); // City5d3hWeather нужно перерендоревать при ресайзе

// Начальная страница

function HomePage() {
    let [localStorageData, setLocalStorageData] = useLoacalStorage(false);
    let homeRef = useRef<HTMLElement>(null);
    let [is_hashOnFirstLoad, set_hash, clear_hash, get_hash] = useHashAddressBar();

    let stateWeatherGeo = useAppStoreSelector((state) => state.weatherGeo);
    let stateWeatherGeoDispatch = useAppStoreDispatch();

    useEffect(() => {
        let firstLoadState = {
            ...stateWeatherGeo,
            lat: is_hashOnFirstLoad ? Number(get_hash().lat) : localStorageData.history[0]?.lat ?? undefined,
            lon: is_hashOnFirstLoad ? Number(get_hash().lon) : localStorageData.history[0]?.lon ?? undefined,
            cityName: is_hashOnFirstLoad ? get_hash().city : localStorageData.history[0]?.name ?? undefined,
        };

        stateWeatherGeoDispatch(updateCity({ lat: firstLoadState.lat, lon: firstLoadState.lon, cityName: firstLoadState.cityName }));
        stateWeatherGeoDispatch(updatePageRef(homeRef));
    }, []);

    useEffect(() => {
        const cityName = stateWeatherGeo.cityName;

        // обновим метаданные тайтла
        update_meta_title(cityName);
        update_meta_desc(cityName);

        if (cityName && cityName !== "") {
            // записываем город в локалсторадж
            let new_data = { name: stateWeatherGeo.cityName!, lat: stateWeatherGeo.lat!, lon: stateWeatherGeo.lon! };
            let new_history = unshuft_unique_obj_to_array_force(localStorageData.history, new_data) as TStorageHistoryCity[];
            setLocalStorageData({ ...localStorageData, history: [...new_history] });

            // обновляем хэш
            clear_hash();
            set_hash("city", cityName);
            set_hash("lat", stateWeatherGeo.lat!.toString());
            set_hash("lon", stateWeatherGeo.lon!.toString());
        }
    }, [stateWeatherGeo.cityName]);

    return (
        <>
            <main className="Home" ref={homeRef}>
                <Header />
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
                <Footer />
            </main>
            <PortalVieport />
        </>
    );
}

const HomePage_memo = memo(HomePage, deep_object_is_equal);

export { HomePage, HomePage_memo };
