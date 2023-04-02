// запрос погоды на 5 дней с 3х часовым интервалом (по внешнему API)
// https://openweathermap.org/forecast5#5days

import { WEATHER_API_KEY, WEATHER_API_ADRESS_5D3H } from "./global_vars";
import { get_system_language } from "./util_functions";
import type * as FetchLatLonTypes from "./fetch_LatLon";

interface IFetch5d3hWeatherArgs {
    lat: number;
    lon: number;
    callBack?: (response: TResponse) => void;
    errorCallback?: () => void;
}

type TresponseObjListObj = {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: [
        {
            id: number;
            main: string;
            description: string;
            icon: string;
        }
    ];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    visibility: number;
    pop: number;
    rain: {
        ["3h"]: number;
    };
    sys: {
        pod: string;
    };
    dt_txt: string;
};

type TresponseObj = {
    cod: string;
    message: number;
    cnt: number;
    list: TresponseObjListObj[];

    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: FetchLatLonTypes.TResponseObj["country"];
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
};

type TResponse = TresponseObj | undefined;

function generate_url(lat: number, lon: number): URL {
    let temp_url = new URL(WEATHER_API_ADRESS_5D3H);
    temp_url.searchParams.set("lat", lat.toString());
    temp_url.searchParams.set("lon", lon.toString());
    temp_url.searchParams.set("units", "metric");
    temp_url.searchParams.set("lang", get_system_language());
    temp_url.searchParams.set("appid", WEATHER_API_KEY);
    return temp_url;
}

async function fetch_5d3h_weather({ lat, lon, callBack = () => {}, errorCallback = () => {} }: Readonly<IFetch5d3hWeatherArgs>) {
    let full_url = generate_url(lat, lon);

    let response: TResponse;

    try {
        let get_response = await fetch(full_url);
        let raw_response = await get_response.json();

        if (raw_response.cod && raw_response.cod !== "200") {
            throw new Error(JSON.stringify(raw_response));
        }

        response = raw_response;
    } catch (err) {
        console.group("ERROR INFO");
        console.error(`Ошибка запроса по адресу ${full_url}`);
        console.error(err);
        console.groupEnd();
        errorCallback();
    }

    callBack(response);
}

export { fetch_5d3h_weather };
export type { IFetch5d3hWeatherArgs, TResponse, TresponseObj };
