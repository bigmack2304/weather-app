import { configureStore } from "@reduxjs/toolkit";
import weatherGeoReducer from "./slises/weather_lat_lon";
import homePageReducer from "./slises/homePage";

const store = configureStore({
    reducer: {
        weatherGeo: weatherGeoReducer,
        homePage: homePageReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["homePage/updatePageRef"],
                ignoredActionPaths: [],
                ignoredPaths: ["homePage.pageRef.current"],
            },
        }),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store };
export type { RootState, AppDispatch };
