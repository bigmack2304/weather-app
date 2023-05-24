import { configureStore } from "@reduxjs/toolkit";
import weatherGeoReducer from "./slises/weather_lat_lon";
import homePageReducer from "./slises/homePage";
import { store_middleware_logger } from "./middleware/logger";

const store = configureStore({
    reducer: {
        weatherGeo: weatherGeoReducer,
        homePage: homePageReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [],
                ignoredActionPaths: [],
                ignoredPaths: [],
            },
        }), // .prepend(store_middleware_logger),  // логгер изменений стейта, отключен так как есть redux dev tools
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store };
export type { RootState, AppDispatch };
