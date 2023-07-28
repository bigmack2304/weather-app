import React, { useEffect } from "react";
import "./NotCityFind.scss";
import { TwoGisMapLoadOnClick } from "../../components/TwoGisMapLoadOnClick/TwoGisMapLoadOnClick";

/**
 * Выводится в случае если при первом открытии страницы не удалось
 * получить город для загрузки погоды (нет данных в url и нет данных в истории)
 *
 */

function NotCityFind() {
    return (
        <div className="NotCityFind">
            <p className="NotCityFind__default_text">Начните поиск.</p>
            <div className="NotCityFind__map">
                <TwoGisMapLoadOnClick />
            </div>
        </div>
    );
}

export { NotCityFind as default };
