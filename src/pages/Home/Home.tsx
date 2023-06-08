import React, { memo, useEffect, useRef } from "react";
import "./Home.scss";
import { deep_object_is_equal } from "../../utils/is_equal";
import { CityCurrentWeather } from "../../components/CityCurrentWeather/CityCurrentWeather";
import { City5d3hWeather } from "../../components/City5d3hWeather/City5d3hWeather";
import type { ICity5d3hWeatherProps } from "../../components/City5d3hWeather/City5d3hWeather";
import { update_meta_title, unshuft_unique_obj_to_array_force, update_meta_desc } from "../../utils/util_functions";
import { useLoacalStorage } from "../../hooks/useLocalStorage";
import "./../../utils/chart_fix";
import "./../../global_styles/chart_fix.scss";
import { ErrorCacher } from "../../HOC/ErrorCacher/ErrorCacher";
import { HocOnResizeUpdate } from "../../HOC/OnResizeUpdate/OnResizeUpdate";
import { updateCity } from "../../redux/slises/weather_lat_lon";
import { updatePageSelector } from "../../redux/slises/homePage";
import { useAppStoreDispatch, useAppStoreSelector } from "../../redux/redux_hooks";
import { useNavigate, useParams } from "react-router-dom";

const City5d3hWeather_onResizeUpdate = HocOnResizeUpdate<ICity5d3hWeatherProps>(City5d3hWeather); // City5d3hWeather нужно перерендоревать при ресайзе

function HomePage() {
    let { lat: urlLat, lon: urlLon, city_name: urlCityName } = useParams();
    let stateWeatherGeo = useAppStoreSelector((state) => state.weatherGeo);
    let stateWeatherGeoDispatch = useAppStoreDispatch();
    const [localStorageData, setLocalStorageData] = useLoacalStorage(false);
    const router_navigate = useNavigate();

    const normalizeUrlParams = () => {
        if (urlCityName) {
            if (urlCityName.startsWith(":")) {
                urlCityName = urlCityName.slice(1);
            }
        }

        if (urlLat) {
            if (urlLat.startsWith(":")) {
                urlLat = urlLat.slice(1);
            }
        }

        if (urlLon) {
            if (urlLon.startsWith(":")) {
                urlLon = urlLon.slice(1);
            }
        }
    };
    normalizeUrlParams();

    // при вервой загрузке обновляем  селектор этого компонента в сторе
    useEffect(() => {
        stateWeatherGeoDispatch(updatePageSelector("div[class*='Home']"));
        return () => {
            stateWeatherGeoDispatch(updatePageSelector(""));
        };
    }, []);

    // при вервой загрузке определим как загружать город, по ссылке, из стора или из локал стораджа
    useEffect(() => {
        let cityName = urlCityName || stateWeatherGeo.cityName || localStorageData.history[0]?.name;
        let lat = Number(urlLat) || stateWeatherGeo.lat || localStorageData.history[0]?.lat;
        let lon = Number(urlLon) || stateWeatherGeo.lon || localStorageData.history[0]?.lon;

        if (cityName == undefined || lat == undefined || lon == undefined) {
            router_navigate("/not_city_find");
        } else {
            router_navigate(`/search/:${cityName}/:${lat}/:${lon}`);
            stateWeatherGeoDispatch(updateCity({ lat, lon, cityName }));
        }

        return () => {};
    }, []);

    // при обновлении стора меняем url и meta
    useEffect(() => {
        let { cityName, lat, lon } = stateWeatherGeo;

        if (cityName && lat && lon) {
            update_meta_title(cityName);
            update_meta_desc(cityName);
            router_navigate(`/search/:${cityName}/:${lat}/:${lon}`);
        }
    }, [stateWeatherGeo.cityName, stateWeatherGeo.lat, stateWeatherGeo.lon]);

    // при обновлении url меняем стор, если они отличаются
    useEffect(() => {
        if (urlLat && urlLon && urlCityName) {
            // console.log(stateWeatherGeo.cityName, urlCityName);
            if (stateWeatherGeo.cityName !== urlCityName) {
                stateWeatherGeoDispatch(updateCity({ lat: Number(urlLat), lon: Number(urlLon), cityName: urlCityName }));
            }
        }
    }, [urlLat, urlLon, urlCityName]);

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
