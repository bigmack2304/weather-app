// запрос текущей погоды (по внешнему API)
// https://openweathermap.org/current
// https://openweathermap.org/weather-conditions#How-to-get-icon-URL

import { WEATHER_API_KEY, WEATHER_API_ADRESS_CURRENT } from "./global_vars";
import { get_system_language } from "./util_functions";
import type * as FetchLatLonTypes from "./fetch_LatLon";

type TresponseObjWeatherObj = {
    id:
        | 200
        | 201
        | 202
        | 210
        | 211
        | 212
        | 221
        | 230
        | 231
        | 232
        | 300
        | 301
        | 302
        | 310
        | 311
        | 312
        | 313
        | 314
        | 321
        | 500
        | 501
        | 502
        | 503
        | 504
        | 511
        | 520
        | 521
        | 522
        | 531
        | 600
        | 601
        | 602
        | 611
        | 612
        | 613
        | 615
        | 620
        | 621
        | 622
        | 701
        | 711
        | 721
        | 731
        | 741
        | 751
        | 761
        | 762
        | 771
        | 781
        | 800
        | 801
        | 802
        | 803
        | 804;
    main:
        | "Thunderstorm"
        | "Drizzle"
        | "Rain"
        | "Snow"
        | "Mist"
        | "Smoke"
        | "Haze"
        | "Dust"
        | "Fog"
        | "Sand"
        | "Dust"
        | "Ash"
        | "Squall"
        | "Tornado"
        | "Clear"
        | "Clouds";
    description: string;
    icon: string;
};

type TresponseObjWeather = TresponseObjWeatherObj[];

interface IFetchCurrentWeatherArgs {
    lat: number;
    lon: number;
    callBack?: (response: TResponse) => void;
    errorCallback?: () => void;
}

type TresponseObj = {
    coord: {
        lon: number;
        lat: number;
    };
    weather: TresponseObjWeather;
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    visibility: number;
    wind?: {
        speed: number;
        deg: number;
        gust: number;
    };
    rain?: {
        ["1h"]?: number;
        ["3h"]?: number;
    };
    snow?: {
        ["1h"]?: number;
        ["3h"]?: number;
    };
    clouds?: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: FetchLatLonTypes.TResponseObj["country"];
        sunrise: number;
        sunset: number;
    };
    timezone: number;
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

async function fetch_current_weather({ lat, lon, callBack = () => {}, errorCallback = () => {} }: Readonly<IFetchCurrentWeatherArgs>) {
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
        errorCallback();
    }

    callBack(response);
}

export { fetch_current_weather };
export type { IFetchCurrentWeatherArgs, TResponse, TresponseObj, TresponseObjWeather, TresponseObjWeatherObj };
