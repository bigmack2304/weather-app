import React, { useEffect } from "react";
import "./NotCityFind.scss";

/**
 * Выводится в случае если при первом открытии страницы не удалось
 * получить город для загрузки погоды (нет данных в url и нет данных в истории)
 *
 */

function NotCityFind() {
    return (
        <div className="NotCityFind">
            <p className="NotCityFind__default_text">Начните поиск.</p>
        </div>
    );
}

export { NotCityFind as default };
