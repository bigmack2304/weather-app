// определение широты и долготы для нужного города (по внешнему API)
// https://openweathermap.org/api/geocoding-api

import { WEATHER_API_ADRESS_GEO, WEATHER_API_KEY } from "./global_vars";

type TLimit = 1 | 2 | 3 | 4 | 5;

type TResponseObj = {
    country: Uppercase<keyof TResponseObj["local_names"]>;
    lat: number;
    lon: number;
    name: string;
    state: string;
    local_names: {
        af?: string;
        ar?: string;
        ascii?: string;
        az?: string;
        bg?: string;
        ca?: string;
        da?: string;
        de?: string;
        el?: string;
        en?: string;
        eu?: string;
        fa?: string;
        feature_name?: string;
        fi?: string;
        fr?: string;
        gl?: string;
        he?: string;
        hi?: string;
        hr?: string;
        hu?: string;
        id?: string;
        it?: string;
        ja?: string;
        la?: string;
        lt?: string;
        mk?: string;
        nl?: string;
        no?: string;
        pl?: string;
        pt?: string;
        ro?: string;
        ru?: string;
        sk?: string;
        sl?: string;
        sr?: string;
        th?: string;
        tr?: string;
        vi?: string;
        zu?: string;
    };
};

type TFullResponse = Array<TResponseObj> | undefined;

interface IFetchLatLonArgs {
    cityName?: string; // наименование искомого города
    limit?: TLimit; // сколько выводить городов с одинаковым имянем
    callBack?: (response: TFullResponse) => void; // колбек, вызывается при получении ответа с сервера, с аргументом ответа
    errorCallback?: () => void; // коллбек, вызывается при возникновении исключения в фече либо если город не найден
    getController?: (obj: AbortController) => void; // коллбек, вызывается перед запросом, в параметры получает AbortController
    notFoundCallback?: () => void; // коллбек, вызывается в случае если город не найден
}

function generate_url(cityName: string, limit: TLimit = 5): URL {
    let temp_url = new URL(WEATHER_API_ADRESS_GEO);
    temp_url.searchParams.set("q", cityName);
    temp_url.searchParams.set("limit", limit.toString());
    temp_url.searchParams.set("appid", WEATHER_API_KEY);
    return temp_url;
}

async function fetch_lat_lon({
    cityName = "",
    limit = 1,
    callBack = (response: TFullResponse) => {},
    errorCallback = () => {},
    getController = () => {},
    notFoundCallback = () => {},
}: Readonly<IFetchLatLonArgs> = {}) {
    let full_url = generate_url(cityName, limit);
    let response: TFullResponse;

    try {
        let controller = new AbortController();
        getController(controller);
        let get_response = await fetch(full_url, { signal: controller.signal });
        let raw_response = await get_response.json();

        if (!Array.isArray(raw_response) && "cod" in raw_response) {
            throw new Error(`cod: ${raw_response.cod}\nmessage: ${raw_response.message}`);
        }

        response = raw_response;
    } catch (err) {
        if (err instanceof Error && err.message.includes("The user aborted a request.")) {
            return;
        }

        console.group("ERROR INFO");
        console.error(`Ошибка запроса по адресу ${full_url}`);
        console.error(err);
        console.groupEnd();

        errorCallback();
    }

    if (Array.isArray(response) && response.length === 0) {
        console.warn(`По запросу ${full_url} ничего не найдено.`);
        response = undefined;
        notFoundCallback();
    }

    callBack(response);
}

export { fetch_lat_lon, generate_url };
export type { IFetchLatLonArgs, TFullResponse, TLimit, TResponseObj };
