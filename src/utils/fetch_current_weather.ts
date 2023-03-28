// запрос текущей погоды (по внешнему API)
// https://openweathermap.org/current

import { WEATHER_API_KEY, WEATHER_API_ADRESS_CURRENT } from "./global_vars";
import { get_system_language } from "./geters_system_info";
import type * as FetchLatLonTypes from "./fetch_LatLon";

interface IFetchCurrentWeatherArgs {
    lat: number;
    lon: number;
    callBack?: (response: TResponse) => void;
}

type TresponseObj = {
    coord: {
        lon: number;
        lat: number;
    };
    weather: [
        {
            id: number;
            main: string;
            description: string;
            icon: string;
        }
    ];
    base: string;
    main: {
        temp: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        message: number;
        country: FetchLatLonTypes.TResponseObj["country"];
        sunrise: number;
        sunset: number;
    };
    id: number;
    name: string;
    cod: number;
};

type TResponse = TresponseObj | undefined;

function generate_url(lat: number, lon: number): URL {
    let temp_url = new URL(WEATHER_API_ADRESS_CURRENT);
    temp_url.searchParams.set("lat", lat.toString());
    temp_url.searchParams.set("lon", lon.toString());
    temp_url.searchParams.set("units", "metric");
    temp_url.searchParams.set("lang", get_system_language());
    temp_url.searchParams.set("appid", WEATHER_API_KEY);
    return temp_url;
}

async function fetch_current_weather({ lat, lon, callBack = () => {} }: Readonly<IFetchCurrentWeatherArgs>) {
    let full_url = generate_url(lat, lon);

    let response: TResponse;

    try {
        let get_response = await fetch(full_url);
        let raw_response = await get_response.json();

        if (raw_response.cod && raw_response.cod !== 200) {
            throw new Error(JSON.stringify(raw_response));
        }

        response = raw_response;
    } catch (err) {
        console.group("ERROR INFO");
        console.error(`Ошибка запроса по адресу ${full_url}`);
        console.error(err);
        console.groupEnd();
    }

    callBack(response);
}

export { fetch_current_weather };
export type { IFetchCurrentWeatherArgs, TResponse, TresponseObj };
