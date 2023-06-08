import React, { useEffect } from "react";
import "./NotCityFind.scss";
import { useAppStoreSelector } from "../../redux/redux_hooks";
import { useNavigate } from "react-router-dom";

/**
 * Выводится в случае если при первом открытии страницы не удалось
 * получить город для загрузки погоды (нет данных в url и нет данных в истории)
 *
 */

function NotCityFind() {
    const redux_store_city = useAppStoreSelector((state) => state.weatherGeo);
    const router_navigate = useNavigate();

    useEffect(() => {
        if (redux_store_city.cityName && redux_store_city.lat && redux_store_city.lon) {
            router_navigate("/search");
        }
    });

    return (
        <div className="NotCityFind">
            <p className="NotCityFind__default_text">Начните поиск.</p>
        </div>
    );
}

export { NotCityFind };
