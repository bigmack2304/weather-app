import React, { useEffect, useState, useLayoutEffect } from "react";
import type { IHomePageProps } from "../../pages/Home/Home";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAppStoreDispatch, useAppStoreSelector } from "../../redux/redux_hooks";
import { updateCity } from "../../redux/slises/weather_lat_lon";
import { useLoacalStorage } from "../../hooks/useLocalStorage";
import { update_meta_title, update_meta_desc } from "../../utils/util_functions";

interface IHomeProvider {
    children: React.ReactElement<IHomePageProps>;
}

type TProps = Readonly<IHomeProvider>;

function removeColon(str: string): string {
    return str.startsWith(":") ? str.slice(1) : str;
}

function HomeProvider({ children }: TProps) {
    const router_navigate = useNavigate();
    let stateWeatherGeoDispatch = useAppStoreDispatch();
    let stateWeatherGeo = useAppStoreSelector((state) => state.weatherGeo);
    const [localStorageData, setLocalStorageData] = useLoacalStorage(false);
    const [isNonCity, setIsNonCity] = useState<boolean>(true); // будет true если
    let urlLatNormalized: number | undefined = undefined;
    let urlLonNormalized: number | undefined = undefined;
    let urlCityNameNormalized: string | undefined = undefined;

    let { lat: urlLat, lon: urlLon, city_name: urlCityName } = useParams(); // пока это сырые данные, нужно удалить двоиточия и преобразовать lat lon в числа
    // нормализуем urlLat urlLon urlCityName
    // думаю именно такое решение будет более эффективно по времяни
    const normalizer = () => {
        if (urlLat) {
            let temp = Number(removeColon(urlLat));
            if (isNaN(temp)) return;
            urlLatNormalized = temp;
        }

        if (urlLon) {
            let temp = Number(removeColon(urlLon));
            if (isNaN(temp)) return;
            urlLonNormalized = temp;
        }

        if (urlCityName) {
            urlCityNameNormalized = removeColon(urlCityName);
        }
    };
    normalizer();

    // при вервой загрузке определим как загружать город, по ссылке, из стора или из локал стораджа
    useLayoutEffect(() => {
        let cityName = urlCityNameNormalized || stateWeatherGeo.cityName || localStorageData.history[0]?.name;
        let lat = urlLatNormalized || stateWeatherGeo.lat || localStorageData.history[0]?.lat;
        let lon = urlLonNormalized || stateWeatherGeo.lon || localStorageData.history[0]?.lon;

        if (cityName == undefined || lat == undefined || lon == undefined) {
            setIsNonCity(true);
        } else {
            setIsNonCity(false);
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
    // это приведет к двойному рендеру но зато у нас будут работать стрелки назад вперед в браузере
    useEffect(() => {
        if (urlLatNormalized && urlLonNormalized && urlCityNameNormalized) {
            // console.log(stateWeatherGeo.cityName, urlCityName);
            if (stateWeatherGeo.cityName !== urlCityNameNormalized) {
                stateWeatherGeoDispatch(updateCity({ lat: urlLatNormalized, lon: urlLonNormalized, cityName: urlCityNameNormalized }));
            }
        }
    }, [urlLatNormalized, urlLonNormalized, urlCityNameNormalized]);

    return <>{isNonCity ? <Navigate to={"/not_city_find"} /> : children}</>;
}

export { HomeProvider };
