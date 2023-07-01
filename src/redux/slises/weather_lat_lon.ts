import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import { get_stprage_data, set_storage_data } from "../../appLocalStorage/appLoacalStorage";
import { unshuft_unique_obj_to_array_force } from "../../utils/util_functions";
import type { TStorageHistoryCity } from "../../appLocalStorage/appLoacalStorage";

import { generate_url } from "../../utils/fetch_LatLon";
import type { TLimit, TFullResponse } from "../../utils/fetch_LatLon";
import { CITY_AUTO_DETECT_NAME } from "../../utils/global_vars";

type TFetchGeoArgs = {
    cityName: string;
    limit?: TLimit;
};

interface IWeatherGeoSlice {
    lat?: number;
    lon?: number;
    cityName?: string;
    isFetchError: boolean;
    isFetchLoading: boolean;
    isNotFound: boolean;
    fetchData: TFullResponse;
    isAutoDetect: boolean;
}

const initialState: IWeatherGeoSlice = {
    lat: undefined,
    lon: undefined,
    cityName: undefined,
    isFetchError: false,
    isFetchLoading: false,
    isNotFound: false,
    fetchData: undefined,
    isAutoDetect: false,
};

const weatherGeoSlice = createSlice({
    name: "weatherGeo",
    initialState: initialState,
    reducers: {
        updateCity: (state, action: PayloadAction<Required<Pick<IWeatherGeoSlice, "lat" | "lon" | "cityName">>>) => {
            // не будем заносить в историю первую стадию автоопределения местоположения
            if (action.payload.cityName !== CITY_AUTO_DETECT_NAME) {
                let localStorageData = get_stprage_data();
                let new_data = { name: action.payload.cityName, lat: action.payload.lat, lon: action.payload.lon };
                let new_history = unshuft_unique_obj_to_array_force(localStorageData.history, new_data) as TStorageHistoryCity[];
                set_storage_data({ ...localStorageData, history: new_history });
            }

            state.cityName = action.payload.cityName;
            state.lat = action.payload.lat;
            state.lon = action.payload.lon;
        },

        setFetchData: (state, action: PayloadAction<TFullResponse>) => {
            state.fetchData = action.payload;
        },

        setFetchError: (state, action: PayloadAction<boolean>) => {
            state.isFetchError = action.payload;
        },

        setFetchLoading: (state, action: PayloadAction<boolean>) => {
            state.isFetchLoading = action.payload;
        },

        setNotFound: (state, action: PayloadAction<boolean>) => {
            state.isNotFound = action.payload;
        },

        setAutoDetect: (state, action: PayloadAction<boolean>) => {
            state.isAutoDetect = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGeo.pending, (state, action) => {
            state.isFetchLoading = true;
            state.isFetchError = false;
            state.isNotFound = false;
        });

        builder.addCase(fetchGeo.fulfilled, (state, action) => {
            state.isFetchLoading = false;
            state.isFetchError = false;

            if (Array.isArray(action.payload)) {
                if (action.payload.length === 0) {
                    state.isNotFound = true;
                    state.fetchData = action.payload;
                } else {
                    state.isNotFound = false;
                    state.fetchData = action.payload;
                }
            }
        });

        builder.addCase(fetchGeo.rejected, (state, action) => {
            state.isFetchLoading = false;
            state.isFetchError = true;
            state.isNotFound = false;
        });
    },
});

const fetchGeo = createAsyncThunk<TFullResponse, TFetchGeoArgs>("weatherGeo/fetchGeo", async (args, { rejectWithValue }) => {
    const { cityName, limit = 5 } = args;
    const full_url = generate_url(cityName, limit);

    try {
        const request = await fetch(full_url);
        const response = await request.json();

        if (!Array.isArray(response) && "cod" in response) {
            throw new Error(`cod: ${response.cod}\nmessage: ${response.message}`, { cause: response });
        }

        return response;
    } catch (err) {
        if (err instanceof Error) {
            console.group("ERROR INFO");
            console.error(`Ошибка запроса по адресу ${full_url}`);
            console.error(err);
            console.log("Обьект ошибки:");
            console.error(err.cause);
            console.groupEnd();
        }

        return rejectWithValue(undefined);
    }
});

const { updateCity, setFetchError, setFetchLoading, setNotFound, setFetchData, setAutoDetect } = weatherGeoSlice.actions;

export type { IWeatherGeoSlice };
export default weatherGeoSlice.reducer;
export { updateCity, setFetchError, setFetchLoading, setNotFound, fetchGeo, setFetchData, weatherGeoSlice, setAutoDetect };
