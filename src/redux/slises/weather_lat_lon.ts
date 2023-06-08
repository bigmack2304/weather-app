import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import { get_stprage_data, set_storage_data } from "../../appLocalStorage/appLoacalStorage";
import { unshuft_unique_obj_to_array_force } from "../../utils/util_functions";
import type { TStorageHistoryCity } from "../../appLocalStorage/appLoacalStorage";

interface IWeatherGeoSlice {
    lat?: number;
    lon?: number;
    cityName?: string;
}

const initialState: IWeatherGeoSlice = {
    lat: undefined,
    lon: undefined,
    cityName: undefined,
};

const weatherGeoSlice = createSlice({
    name: "weatherGeo",
    initialState: initialState,
    reducers: {
        updateCity: (state, action: PayloadAction<IWeatherGeoSlice>) => {
            let localStorageData = get_stprage_data();
            let new_data = { name: action.payload.cityName, lat: action.payload.lat, lon: action.payload.lon };
            let new_history = unshuft_unique_obj_to_array_force(localStorageData.history, new_data) as TStorageHistoryCity[];
            set_storage_data({ ...localStorageData, history: [...new_history] });

            state.cityName = action.payload.cityName;
            state.lat = action.payload.lat;
            state.lon = action.payload.lon;
        },
    },
});

const { updateCity } = weatherGeoSlice.actions;

export type { IWeatherGeoSlice };
export default weatherGeoSlice.reducer;
export { updateCity, weatherGeoSlice };
