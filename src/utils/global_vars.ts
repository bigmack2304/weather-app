const WEATHER_API_KEY = "9a0651d507c8fe770caec576a857cad4"; // ключ для взаимодействия с weather API
const WEATHER_API_ADRESS_GEO = "https://api.openweathermap.org/geo/1.0/direct"; // базовый адрес для запроса широты и долготы города
const WEATHER_API_ADRESS_CURRENT = "https://api.openweathermap.org/data/2.5/weather"; // базовый адрес для запроса текущей погоды
const WEATHER_API_ADRESS_5D3H = "https://api.openweathermap.org/data/2.5/forecast"; // базовый адрес для запроса погоды на 5дней с интервалом 3 часа
const CITY_AUTO_DETECT_NAME = "first-load-auto-detect";
const CITY_NO_NAME_MAP_TAP = "pos-to-map";

export {
    WEATHER_API_KEY,
    WEATHER_API_ADRESS_GEO,
    WEATHER_API_ADRESS_CURRENT,
    WEATHER_API_ADRESS_5D3H,
    CITY_AUTO_DETECT_NAME,
    CITY_NO_NAME_MAP_TAP,
};
