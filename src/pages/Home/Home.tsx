import React, { memo, useState, useContext, useEffect, useRef } from "react";
import { deep_object_is_equal } from "../../utils/is_equal";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { CityCurrentWeather } from "../../components/CityCurrentWeather/CityCurrentWeather";
import { City5d3hWeather } from "../../components/City5d3hWeather/City5d3hWeather";
import "./Home.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import type { TWeatherContext } from "../../Contexts/WeatherContext";
import { update_meta_title, unshuft_unique_obj_to_array_force } from "../../utils/util_functions";
import { useLoacalStorage } from "../../hooks/useLocalStorage";
import { useHashAddressBar } from "../../hooks/useHashAddressBar";
import { PortalVieport } from "../../components/PortalVieport/PortalVieport";

// Начальная страница

function HomePage() {
    let [localStorageData, setLocalStorageData] = useLoacalStorage(false);
    let homeRef = useRef<HTMLElement>(null);
    let [is_hashOnFirstLoad, set_hash, clear_hash, get_hash] = useHashAddressBar();

    let [weatherState, setWeatherState] = useState<TWeatherContext>({
        ...useContext(WeatherContext),

        // если есть хеш в адресе, берем город оттуда, иначе из локал стораджа если есть
        lat: is_hashOnFirstLoad ? Number(get_hash().lat) : localStorageData.history[0]?.lat ?? undefined,
        lon: is_hashOnFirstLoad ? Number(get_hash().lon) : localStorageData.history[0]?.lon ?? undefined,
        cityName: is_hashOnFirstLoad ? get_hash().city : localStorageData.history[0]?.name ?? undefined,

        pageRef: homeRef,

        selectCityCallback: (lat: number, lon: number, cityName: string) => {
            console.log(`response of fetch geo:\n lat: ${lat}, lon: ${lon}, name: ${cityName}`);
            setWeatherState({ ...weatherState, lat, lon, cityName });
        },
    });

    // действия при изменении названия искомого города
    useEffect(() => {
        const cityName = weatherState.cityName;

        // обновим метаданные тайтла
        update_meta_title(cityName);

        if (cityName && cityName !== "") {
            // записываем город в локалсторадж
            let new_data = { name: weatherState.cityName!, lat: weatherState.lat!, lon: weatherState.lon! };
            let new_history = unshuft_unique_obj_to_array_force(localStorageData.history, new_data);
            setLocalStorageData({ ...localStorageData, history: [...new_history] });

            // обновляем хэш
            clear_hash();
            set_hash("city", cityName);
            set_hash("lat", weatherState.lat!.toString());
            set_hash("lon", weatherState.lon!.toString());
        }
    }, [weatherState.cityName]);

    return (
        <WeatherContext.Provider value={weatherState}>
            <main className="Home" ref={homeRef}>
                <section className="Home__weather_now">
                    <h3 className="visually_hidden">Погода на сегодня</h3>
                    <Header />
                    <CityCurrentWeather />
                </section>
                <section className="Home__weather_week">
                    <h3 className="visually_hidden">Погода на 5 дней</h3>
                    {/* <City5d3hWeather /> */}
                </section>
                <Footer />
            </main>
            <PortalVieport />
        </WeatherContext.Provider>
    );
}

const HomePage_memo = memo(HomePage, deep_object_is_equal);

export { HomePage, HomePage_memo };
