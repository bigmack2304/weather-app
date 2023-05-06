// запрос погоды на 5 дней с 3х часовым интервалом (по внешнему API)
// https://openweathermap.org/forecast5#5days

import { WEATHER_API_KEY, WEATHER_API_ADRESS_5D3H } from "./global_vars";
import { get_system_language } from "./util_functions";
import type * as FetchLatLonTypes from "./fetch_LatLon";
import type { TresponseObjWeather } from "./fetch_current_weather";

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
        pressure?: number;
        sea_level?: number;
        grnd_level?: number;
        humidity: number;
        temp_kf: number;
    };
    weather: TresponseObjWeather;
    clouds?: {
        all: number;
    };
    wind?: {
        speed: number;
        deg: number;
        gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
        ["3h"]: number;
    };
    snow?: {
        ["3h"]: number;
    };
    sys: {
        pod: "d" | "n";
    };
    dt_txt?: string;
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
        // TODO закоментировал это чтобы не делать лишних запросов при разработке

        let get_response = await fetch(full_url);
        let raw_response = await get_response.json();

        if (raw_response.cod && raw_response.cod !== "200") {
            throw new Error(JSON.stringify(raw_response));
        }

        response = raw_response;
        // response = JSON.parse(
        //     '{"cod":"200","message":0,"cnt":40,"list":[{"dt":1681722000,"main":{"temp":0.48,"feels_like":0.48,"temp_min":0.48,"temp_max":0.48,"pressure":1000,"sea_level":1000,"grnd_level":975,"humidity":55,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":0.38,"deg":83,"gust":0.93},"visibility":10000,"pop":0.01,"sys":{"pod":"d"},"dt_txt":"2023-04-17 09:00:00"},{"dt":1681732800,"main":{"temp":-0.01,"feels_like":-2.94,"temp_min":-1,"temp_max":-0.01,"pressure":1000,"sea_level":1000,"grnd_level":975,"humidity":61,"temp_kf":0.99},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":2.41,"deg":238,"gust":5.03},"visibility":10000,"pop":0.23,"snow":{"3h":0.11},"sys":{"pod":"d"},"dt_txt":"2023-04-17 12:00:00"},{"dt":1681743600,"main":{"temp":-6.79,"feels_like":-13.79,"temp_min":-10.43,"temp_max":-6.79,"pressure":1004,"sea_level":1004,"grnd_level":980,"humidity":77,"temp_kf":3.64},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13n"}],"clouds":{"all":100},"wind":{"speed":7.13,"deg":301,"gust":13.75},"visibility":5374,"pop":0.64,"snow":{"3h":0.35},"sys":{"pod":"n"},"dt_txt":"2023-04-17 15:00:00"},{"dt":1681754400,"main":{"temp":-12.06,"feels_like":-19.06,"temp_min":-12.06,"temp_max":-12.06,"pressure":1012,"sea_level":1012,"grnd_level":985,"humidity":81,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13n"}],"clouds":{"all":100},"wind":{"speed":5.89,"deg":281,"gust":12.13},"visibility":10000,"pop":0.38,"snow":{"3h":0.11},"sys":{"pod":"n"},"dt_txt":"2023-04-17 18:00:00"},{"dt":1681765200,"main":{"temp":-14.13,"feels_like":-21.13,"temp_min":-14.13,"temp_max":-14.13,"pressure":1015,"sea_level":1015,"grnd_level":988,"humidity":73,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"облачно с прояснениями","icon":"04n"}],"clouds":{"all":57},"wind":{"speed":4.85,"deg":256,"gust":11.57},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-17 21:00:00"},{"dt":1681776000,"main":{"temp":-12.99,"feels_like":-19.99,"temp_min":-12.99,"temp_max":-12.99,"pressure":1016,"sea_level":1016,"grnd_level":989,"humidity":78,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"облачно с прояснениями","icon":"04d"}],"clouds":{"all":78},"wind":{"speed":5.69,"deg":246,"gust":14.49},"visibility":7539,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-18 00:00:00"},{"dt":1681786800,"main":{"temp":-10.51,"feels_like":-17.51,"temp_min":-10.51,"temp_max":-10.51,"pressure":1017,"sea_level":1017,"grnd_level":990,"humidity":64,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":6.61,"deg":258,"gust":15.64},"visibility":10000,"pop":0.54,"snow":{"3h":0.35},"sys":{"pod":"d"},"dt_txt":"2023-04-18 03:00:00"},{"dt":1681797600,"main":{"temp":-8.46,"feels_like":-15.46,"temp_min":-8.46,"temp_max":-8.46,"pressure":1018,"sea_level":1018,"grnd_level":992,"humidity":54,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":7.77,"deg":258,"gust":12.37},"visibility":10000,"pop":0.42,"sys":{"pod":"d"},"dt_txt":"2023-04-18 06:00:00"},{"dt":1681808400,"main":{"temp":-6.4,"feels_like":-13.4,"temp_min":-6.4,"temp_max":-6.4,"pressure":1020,"sea_level":1020,"grnd_level":993,"humidity":56,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":7.45,"deg":257,"gust":12.78},"visibility":10000,"pop":0.06,"sys":{"pod":"d"},"dt_txt":"2023-04-18 09:00:00"},{"dt":1681819200,"main":{"temp":-6.84,"feels_like":-13.84,"temp_min":-6.84,"temp_max":-6.84,"pressure":1022,"sea_level":1022,"grnd_level":995,"humidity":59,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":98},"wind":{"speed":7.04,"deg":260,"gust":13.97},"visibility":10000,"pop":0.06,"sys":{"pod":"d"},"dt_txt":"2023-04-18 12:00:00"},{"dt":1681830000,"main":{"temp":-7.96,"feels_like":-14.96,"temp_min":-7.96,"temp_max":-7.96,"pressure":1024,"sea_level":1024,"grnd_level":997,"humidity":64,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":6.37,"deg":261,"gust":13.35},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-18 15:00:00"},{"dt":1681840800,"main":{"temp":-8.61,"feels_like":-15.61,"temp_min":-8.61,"temp_max":-8.61,"pressure":1026,"sea_level":1026,"grnd_level":999,"humidity":72,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":5.3,"deg":262,"gust":12.27},"visibility":10000,"pop":0.01,"sys":{"pod":"n"},"dt_txt":"2023-04-18 18:00:00"},{"dt":1681851600,"main":{"temp":-9.79,"feels_like":-16.29,"temp_min":-9.79,"temp_max":-9.79,"pressure":1027,"sea_level":1027,"grnd_level":1000,"humidity":82,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":96},"wind":{"speed":3.98,"deg":249,"gust":9.9},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-18 21:00:00"},{"dt":1681862400,"main":{"temp":-10.37,"feels_like":-15.25,"temp_min":-10.37,"temp_max":-10.37,"pressure":1028,"sea_level":1028,"grnd_level":1001,"humidity":87,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"облачно с прояснениями","icon":"04d"}],"clouds":{"all":69},"wind":{"speed":2.46,"deg":238,"gust":7.79},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-19 00:00:00"},{"dt":1681873200,"main":{"temp":-5.28,"feels_like":-10.02,"temp_min":-5.28,"temp_max":-5.28,"pressure":1027,"sea_level":1027,"grnd_level":1000,"humidity":60,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"небольшая облачность","icon":"02d"}],"clouds":{"all":23},"wind":{"speed":3.17,"deg":243,"gust":4.84},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-19 03:00:00"},{"dt":1681884000,"main":{"temp":-1.81,"feels_like":-5.63,"temp_min":-1.81,"temp_max":-1.81,"pressure":1025,"sea_level":1025,"grnd_level":999,"humidity":47,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"небольшая облачность","icon":"02d"}],"clouds":{"all":20},"wind":{"speed":2.95,"deg":248,"gust":3.96},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-19 06:00:00"},{"dt":1681894800,"main":{"temp":-0.63,"feels_like":-4.47,"temp_min":-0.63,"temp_max":-0.63,"pressure":1024,"sea_level":1024,"grnd_level":998,"humidity":47,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"небольшая облачность","icon":"02d"}],"clouds":{"all":15},"wind":{"speed":3.24,"deg":266,"gust":4.21},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-19 09:00:00"},{"dt":1681905600,"main":{"temp":-1.8,"feels_like":-5.67,"temp_min":-1.8,"temp_max":-1.8,"pressure":1024,"sea_level":1024,"grnd_level":998,"humidity":64,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"переменная облачность","icon":"03d"}],"clouds":{"all":34},"wind":{"speed":3.01,"deg":299,"gust":5.04},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-19 12:00:00"},{"dt":1681916400,"main":{"temp":-5.18,"feels_like":-7.74,"temp_min":-5.18,"temp_max":-5.18,"pressure":1025,"sea_level":1025,"grnd_level":998,"humidity":89,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":1.54,"deg":282,"gust":4.77},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-19 15:00:00"},{"dt":1681927200,"main":{"temp":-5.63,"feels_like":-9.13,"temp_min":-5.63,"temp_max":-5.63,"pressure":1025,"sea_level":1025,"grnd_level":998,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.08,"deg":288,"gust":6.3},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-19 18:00:00"},{"dt":1681938000,"main":{"temp":-5.82,"feels_like":-9.42,"temp_min":-5.82,"temp_max":-5.82,"pressure":1026,"sea_level":1026,"grnd_level":999,"humidity":93,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.13,"deg":254,"gust":6.63},"visibility":3600,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-19 21:00:00"},{"dt":1681948800,"main":{"temp":-5.38,"feels_like":-10.09,"temp_min":-5.38,"temp_max":-5.38,"pressure":1027,"sea_level":1027,"grnd_level":1000,"humidity":91,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":3.12,"deg":272,"gust":7.8},"visibility":2071,"pop":0.2,"snow":{"3h":0.15},"sys":{"pod":"d"},"dt_txt":"2023-04-20 00:00:00"},{"dt":1681959600,"main":{"temp":-3.37,"feels_like":-8.5,"temp_min":-3.37,"temp_max":-3.37,"pressure":1028,"sea_level":1028,"grnd_level":1001,"humidity":71,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":4.1,"deg":276,"gust":6.41},"visibility":10000,"pop":0.27,"snow":{"3h":0.11},"sys":{"pod":"d"},"dt_txt":"2023-04-20 03:00:00"},{"dt":1681970400,"main":{"temp":-1.2,"feels_like":-5.77,"temp_min":-1.2,"temp_max":-1.2,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":73,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":4.02,"deg":264,"gust":6.17},"visibility":3716,"pop":0.46,"snow":{"3h":0.32},"sys":{"pod":"d"},"dt_txt":"2023-04-20 06:00:00"},{"dt":1681981200,"main":{"temp":-0.41,"feels_like":-5.06,"temp_min":-0.41,"temp_max":-0.41,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":70,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":4.4,"deg":265,"gust":6.93},"visibility":4596,"pop":1,"snow":{"3h":0.38},"sys":{"pod":"d"},"dt_txt":"2023-04-20 09:00:00"},{"dt":1681992000,"main":{"temp":-0.25,"feels_like":-3.77,"temp_min":-0.25,"temp_max":-0.25,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":65,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"clouds":{"all":100},"wind":{"speed":2.97,"deg":248,"gust":6.25},"visibility":10000,"pop":0.48,"snow":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2023-04-20 12:00:00"},{"dt":1682002800,"main":{"temp":-2.2,"feels_like":-5.93,"temp_min":-2.2,"temp_max":-2.2,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":80,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.78,"deg":215,"gust":7.88},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-20 15:00:00"},{"dt":1682013600,"main":{"temp":-2.34,"feels_like":-6.67,"temp_min":-2.34,"temp_max":-2.34,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":91,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":3.39,"deg":224,"gust":9.05},"visibility":5405,"pop":0.05,"sys":{"pod":"n"},"dt_txt":"2023-04-20 18:00:00"},{"dt":1682024400,"main":{"temp":-2.71,"feels_like":-7.25,"temp_min":-2.71,"temp_max":-2.71,"pressure":1026,"sea_level":1026,"grnd_level":1000,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":3.55,"deg":208,"gust":9.44},"visibility":10000,"pop":0.34,"sys":{"pod":"n"},"dt_txt":"2023-04-20 21:00:00"},{"dt":1682035200,"main":{"temp":-2.19,"feels_like":-6.97,"temp_min":-2.19,"temp_max":-2.19,"pressure":1026,"sea_level":1026,"grnd_level":1000,"humidity":81,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":4,"deg":213,"gust":9.92},"visibility":10000,"pop":0.22,"sys":{"pod":"d"},"dt_txt":"2023-04-21 00:00:00"},{"dt":1682046000,"main":{"temp":0.71,"feels_like":-3.81,"temp_min":0.71,"temp_max":0.71,"pressure":1026,"sea_level":1026,"grnd_level":1000,"humidity":67,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":4.62,"deg":223,"gust":7.63},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-21 03:00:00"},{"dt":1682056800,"main":{"temp":3.85,"feels_like":-0.13,"temp_min":3.85,"temp_max":3.85,"pressure":1025,"sea_level":1025,"grnd_level":1000,"humidity":55,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":5.05,"deg":229,"gust":7.24},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-21 06:00:00"},{"dt":1682067600,"main":{"temp":4.73,"feels_like":1.17,"temp_min":4.73,"temp_max":4.73,"pressure":1025,"sea_level":1025,"grnd_level":1000,"humidity":53,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"пасмурно","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":4.66,"deg":241,"gust":6.93},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-21 09:00:00"},{"dt":1682078400,"main":{"temp":3.93,"feels_like":0.99,"temp_min":3.93,"temp_max":3.93,"pressure":1026,"sea_level":1026,"grnd_level":1000,"humidity":62,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"облачно с прояснениями","icon":"04d"}],"clouds":{"all":81},"wind":{"speed":3.32,"deg":230,"gust":7.6},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-21 12:00:00"},{"dt":1682089200,"main":{"temp":-0.11,"feels_like":-3.71,"temp_min":-0.11,"temp_max":-0.11,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":79,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"облачно с прояснениями","icon":"04n"}],"clouds":{"all":84},"wind":{"speed":3.09,"deg":208,"gust":10.08},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-21 15:00:00"},{"dt":1682100000,"main":{"temp":-1.18,"feels_like":-5.19,"temp_min":-1.18,"temp_max":-1.18,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":82,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"облачно с прояснениями","icon":"04n"}],"clouds":{"all":59},"wind":{"speed":3.31,"deg":207,"gust":10.29},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-21 18:00:00"},{"dt":1682110800,"main":{"temp":-2.06,"feels_like":-5.98,"temp_min":-2.06,"temp_max":-2.06,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":90,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"небольшая облачность","icon":"02n"}],"clouds":{"all":23},"wind":{"speed":3.01,"deg":193,"gust":8.27},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2023-04-21 21:00:00"},{"dt":1682121600,"main":{"temp":-1.84,"feels_like":-5.89,"temp_min":-1.84,"temp_max":-1.84,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":89,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"переменная облачность","icon":"03d"}],"clouds":{"all":37},"wind":{"speed":3.2,"deg":189,"gust":8.14},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-22 00:00:00"},{"dt":1682132400,"main":{"temp":3.35,"feels_like":0.16,"temp_min":3.35,"temp_max":3.35,"pressure":1027,"sea_level":1027,"grnd_level":1001,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"переменная облачность","icon":"03d"}],"clouds":{"all":45},"wind":{"speed":3.49,"deg":207,"gust":5.48},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-22 03:00:00"},{"dt":1682143200,"main":{"temp":6.29,"feels_like":3.79,"temp_min":6.29,"temp_max":6.29,"pressure":1026,"sea_level":1026,"grnd_level":1000,"humidity":47,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"переменная облачность","icon":"03d"}],"clouds":{"all":48},"wind":{"speed":3.4,"deg":215,"gust":4.51},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2023-04-22 06:00:00"}],"city":{"id":1511494,"name":"Анжеро-Судженск","coord":{"lat":56.0778,"lon":86.0194},"country":"RU","population":82526,"timezone":25200,"sunrise":1681686390,"sunset":1681737860}}'
        // );
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
export type { IFetch5d3hWeatherArgs, TResponse, TresponseObj, TresponseObjListObj };
