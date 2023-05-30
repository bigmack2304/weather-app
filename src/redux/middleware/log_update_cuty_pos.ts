import type { Action } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IWeatherGeoSlice } from "../slises/weather_lat_lon";

function isIWeatherGeoUpdateCity(action: Action): action is PayloadAction<IWeatherGeoSlice> {
    return action.type == "weatherGeo/updateCity";
}

function store_city_pos_logger(store: any) {
    return function (next: any) {
        return function (action: Action) {
            if (isIWeatherGeoUpdateCity(action)) {
                console.groupCollapsed("state: city pos search updated");
                console.log(action.payload);
                console.groupEnd();
            }

            next(action);
        };
    };
}

export { store_city_pos_logger };
