type object_keys = {
    [key: string]: any;
};

// проверка двух функций на идентичность
// если результат чтения функции [native code] то щитаем что они не равны
function function_is_equal(func_1: Function, func_2: Function): boolean {
    let func_1_str = func_1.toString();
    let func_2_str = func_2.toString();

    const is_nativeCode = (str: string): boolean => {
        return str.includes("[native code]");
    };

    if (is_nativeCode(func_1_str) || is_nativeCode(func_2_str)) {
        return false;
    }

    return func_1_str == func_2_str;
}

// глубокое сравнение двух массивов по значениям
function deep_array_is_equal(arr1: any[], arr2: any[]): boolean {
    let result: boolean = true;

    if (arr1.length == arr2.length) {
        for (let i = 0; i < arr1.length; i++) {
            if (Array.isArray(arr1[i])) {
                if (Array.isArray(arr2[i])) {
                    result = deep_array_is_equal(arr1[i], arr2[i]);
                    if (!result) {
                        break;
                    }
                    continue;
                } else {
                    result = false;
                    break;
                }
            }

            if (arr1[i] instanceof Function) {
                if (arr2[i] instanceof Function) {
                    result = function_is_equal(arr1[i], arr2[i]);
                    if (!result) {
                        break;
                    }
                    continue;
                } else {
                    result = false;
                    break;
                }
            }

            if (typeof arr1[i] === "object") {
                if (typeof arr2[i] === "object") {
                    result = deep_object_is_equal(arr1[i], arr2[i]);
                    if (!result) {
                        break;
                    }
                    continue;
                } else {
                    result = false;
                    break;
                }
            }

            if (arr1[i] !== arr2[i]) {
                result = false;
                break;
            }
        }
    } else {
        result = false;
    }

    return result;
}

// глубокое сравнение двух обьектов по значениям, вернет true если одинаковы
function deep_object_is_equal(obj1: Readonly<object_keys>, obj2: Readonly<object_keys>): boolean {
    let result: boolean = true;
    let len: number = 0;

    const get_obj_length = (obj: Readonly<object_keys>): number => {
        let objLen = 0;

        for (let key in obj) {
            objLen++;
        }

        return objLen;
    };

    for (let key in obj1) {
        len++;

        if (obj2[key] === undefined) {
            result = false;
            break;
        }

        if (Array.isArray(obj1[key])) {
            if (Array.isArray(obj2[key])) {
                result = deep_array_is_equal(obj1[key], obj2[key]);
                if (!result) {
                    break;
                }
                continue;
            } else {
                result = false;
                break;
            }
        }

        if (obj1[key] instanceof Function) {
            if (obj2[key] instanceof Function) {
                result = function_is_equal(obj1[key], obj2[key]);
                if (!result) {
                    break;
                }
                continue;
            } else {
                result = false;
                break;
            }
        }

        if (typeof obj1[key] === "object") {
            if (typeof obj2[key] === "object") {
                result = deep_object_is_equal(obj1[key], obj2[key]);
                if (!result) {
                    break;
                }
                continue;
            } else {
                result = false;
                break;
            }
        }

        if (obj1[key] !== obj2[key]) {
            result = false;
            break;
        }
    }

    if (result && len != get_obj_length(obj2)) {
        result = false;
    }

    return result;
}

export { function_is_equal, deep_array_is_equal, deep_object_is_equal };
