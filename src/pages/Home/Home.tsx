import React, { memo, useState, useContext, useEffect } from "react";
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

// Начальная страница

function HomePage() {
    let [localStorageData, setLocalStorageData] = useLoacalStorage(false);
    let [weatherState, setWeatherState] = useState<TWeatherContext>({
        ...useContext(WeatherContext),

        lat: localStorageData.history[0]?.lat ?? undefined,
        lon: localStorageData.history[0]?.lon ?? undefined,
        cityName: localStorageData.history[0]?.name ?? undefined,

        selectCityCallback: (lat: number, lon: number, cityName: string) => {
            console.log(`response of fetch geo:\n lat: ${lat}, lon: ${lon}, name: ${cityName}`);
            setWeatherState({ ...weatherState, lat, lon, cityName });
        },
    });

    useEffect(() => {
        const cityName = weatherState.cityName;

        update_meta_title(cityName);

        if (cityName && cityName !== "") {
            let new_data = { name: weatherState.cityName!, lat: weatherState.lat!, lon: weatherState.lon! };
            let new_history = unshuft_unique_obj_to_array_force(localStorageData.history, new_data);
            setLocalStorageData({ ...localStorageData, history: [...new_history] });
        }
    }, [weatherState.cityName]);

    return (
        <WeatherContext.Provider value={weatherState}>
            <main className="Home">
                <section className="Home__weather_now">
                    <h3 className="visually_hidden">Погода на сегодня</h3>
                    <Header />
                    <CityCurrentWeather />
                </section>
                <section className="Home__weather_week">
                    <h3 className="visually_hidden">Погода на 5 дней</h3>
                    <City5d3hWeather />
                </section>
                <Footer />
            </main>
        </WeatherContext.Provider>
    );
}

const HomePage_memo = memo(HomePage, deep_object_is_equal);

export { HomePage, HomePage_memo };
