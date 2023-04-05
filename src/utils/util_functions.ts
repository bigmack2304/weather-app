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
};
