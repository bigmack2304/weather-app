import React, { memo, useState, useContext, useEffect } from "react";
import { deep_object_is_equal } from "../../utils/is_equal";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { CityCurrentWeather } from "../../components/CityCurrentWeather/CityCurrentWeather";
import "./Home.scss";
import { WeatherContext } from "../../Contexts/WeatherContext";
import type { TWeatherContext } from "../../Contexts/WeatherContext";
import { update_meta_title } from "../../utils/util_functions";

// Начальная страница

function HomePage() {
    let [weatherState, setWeatherState] = useState<TWeatherContext>({
        ...useContext(WeatherContext),
        selectCityCallback: (lat: number, lon: number, cityName: string) => {
            console.log(`lat ${lat}, lon ${lon}, name ${cityName}`);
            setWeatherState({ ...weatherState, lat, lon, cityName });
        },
    });

    useEffect(() => {
        update_meta_title(weatherState.cityName);
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
                </section>
                <Footer />
            </main>
        </WeatherContext.Provider>
    );
}

const HomePage_memo = memo(HomePage, deep_object_is_equal);

export { HomePage, HomePage_memo };
