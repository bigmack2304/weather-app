import type * as fetchCityLatLon from "./fetch_LatLon";
import type * as currentWeather from "./fetch_current_weather";
import { deep_object_is_equal } from "./is_equal";

// конвертирует код страны в полное название страны, с учетом языка пользователя
// испоьзование get_full_country_by_code.of("код страны, US например")
const intlDisplayNames = new Intl.DisplayNames([get_system_language()], { type: "region" });

// более удобный интерфейс для intlDisplayNames
function get_full_country_by_code(countryCode: string) {
    return intlDisplayNames.of(countryCode);
}

// получить код используемого устройством языка ("ru", "en", ...)
function get_system_language(): string {
    let language = window.navigator.language;
    if (language.includes("-")) {
        language = language.slice(0, language.indexOf("-"));
    }
    return language.toLowerCase();
}

/*
    возврощает true если ширина окна менее 440px
*/
function is_mobile_screen(): boolean {
    return window.innerWidth >= 440 ? false : true;
}

/*
    возврощает true если на устройстве мультитач
    (для пк в 98% вернет false, тк мало у кого сенсорный экран)
*/
function is_multiTuch(): boolean {
    if (window.navigator.maxTouchPoints > 1) {
        return true;
    }
    return false;
}

// проверяет поддерживает указатель экрана HOVER
// например тачпад с сенсорным экраном его не поддерживает покеа не подключим мышку
function is_hover_screen() {
    const isHoverableDevice = window.matchMedia("(hover: hover) and (pointer: fine)");
    return isHoverableDevice.matches;
}

/*
    Попытка определить мобильное устройство.
    true если это мобила
    PS: метод не самый лучший, но для начала сойдет
*/
function is_device_mobile() {
    return is_mobile_screen() || is_multiTuch() ? true : false;
}

// возвращает название города в соответствии с текущей локалью, из обьекта  типа fetchCityLatLon.TResponseObj
// если ланной локали там не найдется то вернет дефолтное название
function get_localed_city_name(city: fetchCityLatLon.TResponseObj) {
    if (city.local_names) {
        let locale = get_system_language() as keyof typeof city.local_names;
        if (city.local_names[locale]) {
            return city.local_names[locale] as string;
        }
    }
    return city.name;
}

// задает новое имя для страницы
function update_meta_title(cityName: string | undefined) {
    const docHead = document.querySelector("head")!;
    let text = cityName ? `в ${cityName}` : "";
    docHead.querySelector("title")!.textContent = `Погода ${text}`;
}

// добавляет обьект (в начало) в массива обьектов, только если в этом массиве нету таковоже обьекта (по значениям),
// возвращает новый массив.
function unshuft_unique_obj_to_array<T extends object>(arr: Readonly<T[]>, obj: Readonly<T>): T[] {
    let is_new_object_unique = true;

    for (let elem of arr) {
        if (deep_object_is_equal(elem, obj)) {
            is_new_object_unique = false;
        }
    }

    if (is_new_object_unique) {
        return [obj, ...arr];
    }

    return arr as T[];
}

// добавляет обьект (в начало) в массива обьектов, еслли в массиве уже был такойже обьект (по значениям),
// то он удаляется, возвращает новый массив.
function unshuft_unique_obj_to_array_force<T extends object>(arr: Readonly<T[]>, obj: Readonly<T>): T[] {
    let temp_arr: T[] = [...arr];

    temp_arr = temp_arr.filter((value) => {
        if (deep_object_is_equal(value, obj)) {
            return false;
        }
        return true;
    });

    temp_arr.unshift(obj);

    return temp_arr;
}

// находит такойже обьект (по значениям) в массиве обьектов, и удаляет его из массива
// возвращает новый массив
function delete_obj_from_array<T extends object>(arr: Readonly<T[]>, obj: Readonly<T>): T[] {
    let temp_arr: T[] = [...arr];

    temp_arr = temp_arr.filter((value) => {
        if (deep_object_is_equal(value, obj)) {
            return false;
        }
        return true;
    });

    return temp_arr;
}

// преобразует любое число в значение от 0 до 359,
// 0->0, 359->359, 361->1,360->0, 400->40 ... (Закольцоввывает любое число на 360)
function number_to_deg360(value: number) {
    let positive_value = to_positive_value(value);
    return positive_value % 360;
}

// инвертирует направление (deg-360) например deg_invesion(181) -> 1
function deg_invesion(deg: number) {
    let positive_deg = to_positive_value(deg);
    return number_to_deg360(positive_deg + 180);
}

// если число отрицательное то преобразуем его в положительное
function to_positive_value(value: number) {
    return value >= 0 ? value : Math.abs(0 - value);
}

// преобразует градусы в текст 0 - северное 180 - южное итд
function deg_to_compass(val: number) {
    // 0 45 90 135 180 225 270 315
    const STEP = 22.5;

    if (val > 360 - STEP || val < 0 + STEP) {
        return "северный";
    }

    if (val > 45 - STEP && val < 45 + STEP) {
        return "северно-восточный";
    }

    if (val > 90 - STEP && val < 90 + STEP) {
        return "восточный";
    }

    if (val > 135 - STEP && val < 135 + STEP) {
        return "южно-восточный";
    }

    if (val > 180 - STEP && val < 180 + STEP) {
        return "южный";
    }

    if (val > 225 - STEP && val < 225 + STEP) {
        return "южно-западный";
    }

    if (val > 270 - STEP && val < 270 + STEP) {
        return "западный";
    }

    if (val > 315 - STEP && val < 315 + STEP) {
        return "северно-западный";
    }
}

// преобразует Date или таймштамп в строку со времянем
const intl_day_num = new Intl.DateTimeFormat([get_system_language()], { day: "numeric" });
const intl_day_name = new Intl.DateTimeFormat([get_system_language()], { weekday: "long" });
const intl_day_name_short = new Intl.DateTimeFormat([get_system_language()], { weekday: "short" });
const intl_year_num = new Intl.DateTimeFormat([get_system_language()], { year: "numeric" });
const intl_month_name = new Intl.DateTimeFormat([get_system_language()], { month: "long" });
const intl_month_num = new Intl.DateTimeFormat([get_system_language()], { month: "numeric" });
const intl_month_numUTC = new Intl.DateTimeFormat([get_system_language()], { month: "numeric", timeZone: "UTC" });
const intl_dayNum_monthName = new Intl.DateTimeFormat([get_system_language()], { month: "long", day: "numeric" });
const intl_minutes = new Intl.DateTimeFormat([get_system_language()], { minute: "2-digit" });
const intl_hours = new Intl.DateTimeFormat([get_system_language()], { hour: "2-digit" });
const intl_day_numUTC = new Intl.DateTimeFormat([get_system_language()], { day: "numeric", timeZone: "UTC" });
const intl_day_nameUTC = new Intl.DateTimeFormat([get_system_language()], { weekday: "long", timeZone: "UTC" });
const intl_year_numUTC = new Intl.DateTimeFormat([get_system_language()], { year: "numeric", timeZone: "UTC" });
const intl_month_nameUTC = new Intl.DateTimeFormat([get_system_language()], { month: "long", timeZone: "UTC" });
const intl_dayNum_monthNameUTC = new Intl.DateTimeFormat([get_system_language()], { month: "long", day: "numeric", timeZone: "UTC" });
const intl_hoursUTC = new Intl.DateTimeFormat([get_system_language()], { hour: "2-digit", timeZone: "UTC" });
const intl_minutesUTC = new Intl.DateTimeFormat([get_system_language()], { minute: "2-digit", timeZone: "UTC" });

function get_text_date(date: Date | number = new Date()) {
    if (typeof date === "number") {
        date = new Date(date);
    }

    const to_twoDigit = (str: string) => {
        if (str == "0") {
            return "00";
        }

        return str;
    };

    return {
        day_num: intl_day_num.format(date),
        day_name: intl_day_name.format(date),
        day_name_short: intl_day_name_short.format(date),
        year_num: intl_year_num.format(date),
        month_name: intl_month_name.format(date),
        month_num: intl_month_num.format(date),
        month_numUTC: intl_month_numUTC.format(date),
        dayNum_monthName: intl_dayNum_monthName.format(date),
        minutes: to_twoDigit(intl_minutes.format(date)),
        hours: to_twoDigit(intl_hours.format(date)),
        day_numUTC: intl_day_numUTC.format(date),
        day_nameUTC: intl_day_nameUTC.format(date),
        year_numUTC: intl_year_numUTC.format(date),
        month_nameUTC: intl_month_nameUTC.format(date),
        dayNum_monthNameUTC: intl_dayNum_monthNameUTC.format(date),
        hoursUTC: to_twoDigit(intl_hoursUTC.format(date)),
        minutesUTC: to_twoDigit(intl_minutesUTC.format(date)),
    };
}

// ДЛЯ получения времяни восхода и захода солнца из weather api
function calc_sun_hours_details(sunrise_timestamp_sec: number, sunset_timestamp_sec: number, shift_timezone: number = 0) {
    // Date принимает таймштамп в милисекундах
    let date_sunrise = new Date((sunrise_timestamp_sec + shift_timezone) * 1000);
    let date_sunset = new Date((sunset_timestamp_sec + shift_timezone) * 1000);

    let sun_hours_details = {
        sunrise: {
            hours: date_sunrise.getUTCHours(),
            minutes: date_sunrise.getUTCMinutes(),
            timestamp: date_sunrise.getTime(),
        },
        sunset: {
            hours: date_sunset.getUTCHours(),
            minutes: date_sunset.getUTCMinutes(),
            timestamp: date_sunset.getTime(),
        },
    };

    return sun_hours_details;
}

// возвращает наименование времяни суток в городе с учетом восхода и захода солнца
function calc_weather_day_time(
    sun_data: ReturnType<typeof calc_sun_hours_details>,
    time_data: { dt: number; timezone: number }
): "NIGHT" | "EVENING" | "DAY" | "MORNING" | "UNKNOWN" {
    const HOUR_MS = 3_600_000 * 2; // часовая граница для утра и вечера (+- 2часа)
    let now_date = new Date((time_data.dt + time_data.timezone) * 1000);
    let now_timestamp = now_date.getTime();

    // ночь
    if (now_timestamp > sun_data.sunset.timestamp || now_timestamp < sun_data.sunrise.timestamp) {
        return "NIGHT";
    }

    // вечер
    if (now_timestamp >= sun_data.sunset.timestamp - HOUR_MS && now_timestamp <= sun_data.sunset.timestamp) {
        return "EVENING";
    }

    // день
    if (now_timestamp < sun_data.sunset.timestamp - HOUR_MS && now_timestamp > sun_data.sunrise.timestamp + HOUR_MS) {
        return "DAY";
    }

    // утро
    if (now_timestamp >= sun_data.sunrise.timestamp && now_timestamp <= sun_data.sunrise.timestamp + HOUR_MS) {
        return "MORNING";
    }

    // поидее это никогда не должно отработать
    return "UNKNOWN";
}

// расчитывает ип фона для приложения, в зависимости от времяни и условий погоды
function calc_backgraund_type(sun_data: ReturnType<typeof calc_sun_hours_details>, currentWeather: currentWeather.TResponse) {
    if (!currentWeather) return;

    let generated_name: string = ""; // это будет выходная строка с названием класса
    let wather_status = currentWeather.weather[0].main.toLowerCase() as Lowercase<currentWeather.TresponseObjWeatherObj["main"]>;
    let is_bad_weather =
        wather_status &&
        (wather_status == "rain" ||
            wather_status == "snow" ||
            wather_status == "drizzle" ||
            wather_status == "thunderstorm" ||
            (currentWeather.weather[0].id >= 701 && currentWeather.weather[0].id <= 781) ||
            currentWeather.weather[0].id >= 804);
    let day_time = calc_weather_day_time(sun_data, currentWeather);

    // ночь
    if (day_time === "NIGHT") {
        generated_name = generated_name + "night";
    }

    // вечер
    if (day_time === "EVENING") {
        generated_name = generated_name + "evening";
        if (is_bad_weather) {
            generated_name = generated_name + "_cloudy";
        }
    }

    // день
    if (day_time === "DAY") {
        generated_name = generated_name + "day";
        if (is_bad_weather) {
            generated_name = generated_name + "_cloudy";
        }
    }

    // утро
    if (day_time === "MORNING") {
        generated_name = generated_name + "morning";
        if (is_bad_weather) {
            generated_name = generated_name + "_cloudy";
        }
    }

    return generated_name;
}

// Приобразуем значение из одного диапозона в тоже значение но в другом диапозоне
function addon_map(val: number, val_min: number, val_max: number, need_min: number, need_max: number) {
    let shkal_orig, shkal_new, new_val;
    shkal_orig = val_max - val_min;
    shkal_orig = shkal_orig / 100;
    shkal_orig = (val - val_min) / shkal_orig;
    shkal_new = need_max > need_min ? need_max - need_min : need_min - need_max;
    shkal_new = shkal_new / 100;
    new_val = shkal_new * shkal_orig;
    new_val = new_val + need_min;
    return new_val;
}

// поучаем давление из hpa в милиметры ртутного стоба
function convert_hpa_to_mmRtSt(val: { pressure: number | undefined; grnd_level: number | undefined }) {
    if (val.pressure) {
        return Math.round(val.pressure * 0.75);
    }

    return Math.round(val.grnd_level! * 0.75);
}

// вычесяет смещение элемента относительно всего документа
function GetElementOffsetsInDocument(elem: HTMLElement): { top: number; left: number } {
    let offsets = { top: 0, left: 0 };

    do {
        if (!isNaN(elem.offsetLeft)) {
            offsets.left += elem.offsetLeft;
        }
        if (!isNaN(elem.offsetTop)) {
            offsets.top += elem.offsetTop;
        }
    } while ((elem = elem.offsetParent as HTMLElement));

    return offsets;
}

export {
    get_full_country_by_code,
    get_system_language,
    get_localed_city_name,
    update_meta_title,
    unshuft_unique_obj_to_array,
    unshuft_unique_obj_to_array_force,
    delete_obj_from_array,
    number_to_deg360,
    deg_invesion,
    to_positive_value,
    deg_to_compass,
    is_device_mobile,
    get_text_date,
    is_hover_screen,
    calc_sun_hours_details,
    calc_backgraund_type,
    calc_weather_day_time,
    addon_map,
    convert_hpa_to_mmRtSt,
    GetElementOffsetsInDocument,
};
