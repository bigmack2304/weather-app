import React, { useEffect, useRef, useState, useId, memo } from "react";
import { gisMaps } from "./gisMapModule";
import { useAppStoreSelector, useAppStoreDispatch } from "../../redux/redux_hooks";
import { updateCity, setAutoDetect } from "../../redux/slises/weather_lat_lon";
import { CITY_NO_NAME_MAP_TAP } from "../../utils/global_vars";
import { is_device_mobile } from "../../utils/util_functions";

// страница с API https://api.2gis.ru/doc/maps/ru/quickstart/

// Типизации для этого API нет, поэтому пока поставил затычки типа (any)

interface ITwoGisMaps {
    addClassName?: string[];
    center?: [number, number];
    startZoom?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;
    isFlyToAnim?: "true" | "false" | "auto";
    mapInitConfig?: object;
}

type TProps = Readonly<ITwoGisMaps>;

const map_base_config = {
    maxZoom: 20,
    minZoom: 2,
    closePopupOnClick: false,
    maxBounds: [
        [84.9593, -200.0],
        [-85.0321, 200.0],
    ],
};

function TwoGisMaps({ center = [1.0, 1.0], startZoom = 4, mapInitConfig = {}, addClassName = [""], isFlyToAnim = "auto" }: TProps) {
    const componentClassName = [...addClassName, "TwoGisMaps_wrapper"].join(" ");
    const isFirstRender = useRef(false); // защита от повторного перерендера в режиме React.StrictMode
    const MapId = useId();
    const [map, setMap] = useState<any>(null);
    const { lat, lon, cityName } = useAppStoreSelector((state) => state.weatherGeo);
    const markersLayer = useRef<any>(null); // слой с маркерами карты
    const marker = useRef<any>(null); // маркер на карте, для которой показхан прогноз погоды
    const storeDispatch = useAppStoreDispatch();

    // странно но тут эта проверка корректно работает при изменении ресайза, несмотря на то что явно тут никаких обработчиков ресайза нету
    const calc_isFlyToAnim = () => {
        if (isFlyToAnim == "auto") return !is_device_mobile();
        if (isFlyToAnim == "true") return true;
        return false;
    };

    const on_map_click = (e: any) => {
        let map_clicked_lat = Number((e.latlng.lat as Number).toFixed(3));
        let map_clicked_lon = Number((e.latlng.lng as Number).toFixed(3));

        // если попап на маркере открыт, то закрываем попап, новый поиск не начинаем
        if (marker.current && marker.current.getPopup().isOpen()) {
            marker.current.closePopup();
            return;
        }

        storeDispatch(setAutoDetect(false)); // нужно сбросить флаг автоматического определения города, потому как это уже не автоопределение. На случай если до этого было автоопределение.
        storeDispatch(updateCity({ lat: map_clicked_lat, lon: map_clicked_lon, cityName: CITY_NO_NAME_MAP_TAP }));
    };

    // монтирование компонента
    useEffect(() => {
        if (!isFirstRender.current) {
            console.log(gisMaps);
            isFirstRender.current = true;
            setMap(new gisMaps.Map(MapId, { ...map_base_config, center, zoom: startZoom, ...mapInitConfig }));
        }
    }, []);

    // дополнительные настройки инициализированной карты и размонтирование для экземпляра карт
    useEffect(() => {
        if (map) {
            map.on("click", on_map_click);
        }

        return () => {
            if (map && isFirstRender.current) {
                isFirstRender.current = true;
                (map as any).remove();
                setMap(null);
            }
        };
    }, [map]);

    // ставит точку на карте на координаты искомого города из стора и перемещает камеру на нее.
    const set_marker_on_city_pos = () => {
        if (!lat || !lon || !map) return;

        const new_markersLayer = gisMaps.featureGroup(); // создаем новый слой с маркером

        const CalcCityName = () => {
            if (cityName && cityName !== CITY_NO_NAME_MAP_TAP) return cityName;
            if (cityName && cityName == CITY_NO_NAME_MAP_TAP) return "Погода для этой точки";
            return "";
        };

        if (markersLayer.current !== null) {
            markersLayer.current.removeFrom(map); // если до этого уже был слой с маркерами то удаляем старый слой с карты
        }

        if (markersLayer) {
            marker.current = gisMaps.marker([lat, lon]);
            marker.current.addTo(new_markersLayer);
            marker.current.bindPopup(CalcCityName());

            markersLayer.current = new_markersLayer; // запоминаем новый слой с маркерами
            new_markersLayer.addTo(map); // добавляем новый слой на карты
        }

        map.flyTo([lat, lon], 14, { duration: 3.0, animate: calc_isFlyToAnim() }); // перемещаем окно карты на этот маркер
    };

    set_marker_on_city_pos();

    return (
        <div className={componentClassName}>
            <div id={MapId} className="TwoGisMaps"></div>
        </div>
    );
}

export { TwoGisMaps as default };
