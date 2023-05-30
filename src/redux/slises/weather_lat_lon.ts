import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

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
