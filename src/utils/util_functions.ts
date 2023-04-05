import type * as fetchCityLatLon from "./fetch_LatLon";
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
        return "северное";
    }

    if (val > 45 - STEP && val < 45 + STEP) {
        return "северно-восточное";
    }

    if (val > 90 - STEP && val < 90 + STEP) {
        return "восточное";
    }

    if (val > 135 - STEP && val < 135 + STEP) {
        return "южно-восточное";
    }

    if (val > 180 - STEP && val < 180 + STEP) {
        return "южное";
    }

    if (val > 225 - STEP && val < 225 + STEP) {
        return "южно-западное";
    }

    if (val > 270 - STEP && val < 270 + STEP) {
        return "западное";
    }

    if (val > 315 - STEP && val < 315 + STEP) {
        return "северно-западное";
    }
}

function get_text_date(date: Date | number = new Date()) {
    if (typeof date === "number") {
        date = new Date(date);
    }

    return {
        day_num: new Intl.DateTimeFormat([get_system_language()], { day: "numeric" }).format(date),
        day_name: new Intl.DateTimeFormat([get_system_language()], { weekday: "long" }).format(date),
        year_num: new Intl.DateTimeFormat([get_system_language()], { year: "numeric" }).format(date),
        month_name: new Intl.DateTimeFormat([get_system_language()], { month: "long" }).format(date),
        dayNum_monthName: new Intl.DateTimeFormat([get_system_language()], { month: "long", day: "numeric" }).format(date),
        minutes: new Intl.DateTimeFormat([get_system_language()], { minute: "numeric" }).format(date),
        hours: new Intl.DateTimeFormat([get_system_language()], { hour: "numeric" }).format(date),
    };
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
};
