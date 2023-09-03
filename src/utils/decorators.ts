import { deep_array_is_equal } from "./is_equal";

type TanyFunc = (...args: any[]) => any;

interface ICallStackElement {
    argum: any[];
}

/* 

    декоратор, не позволяет вызывать функцию непрерывно, вместо этого накопливает параметры вызовов
    функции (func) и по интервалу delay вызывает func асинхронно столько раз сколько мы ее вызывали, с темиже параметрами.

    После выполнения всего стека вызовов будет вызвана функция (callback) которую
    мы должны указать.
*/
function caller_delay_callback<T extends TanyFunc>(func: T, callback = () => {}, delay: number = 0) {
    let call_stack: ICallStackElement[] = [];
    let is_start: boolean = false;

    return function caller(...args: Parameters<T>): void {
        call_stack.push({ argum: args });

        const func_call = () => {
            if (call_stack.length >= 1) {
                let { argum } = call_stack.shift() as ICallStackElement; // трудоемкая процедура
                func(...argum);
                setTimeout(func_call, delay);
            } else {
                is_start = false;
                callback();
            }
        };

        if (!is_start) {
            is_start = true; // выставляем флаг работы
            setTimeout(func_call, delay);
        }
    };
}

/*
    не позволяет вызывать функцию непрерывно, вместо этого вызывает функцию с последними переданными аргументами
    delay это милисекунды в течении которых вызов функции будет обновлять последние переданные аргументы
    и сбрасывать delay

    После выполнения оборачиваемой функции будет вызвана функция (callback) которую
    мы должны указать.
*/
function first_caller_delay_callback<T extends TanyFunc>(func: T, callback = () => {}, delay: number = 0) {
    let call_stack: ICallStackElement;
    let is_start: boolean = false;
    let timer_id: any = 0;

    return function caller(...args: Parameters<T>): void {
        call_stack = { argum: args };

        const func_call = () => {
            let { argum } = call_stack as ICallStackElement; // трудоемкая процедура
            func(...argum);
            is_start = false;
            callback();
        };

        if (is_start) {
            clearTimeout(timer_id);
        }

        is_start = true; // выставляем флаг работы
        timer_id = setTimeout(func_call, delay);
    };
}

/*
    декоратор, не позволяет вызывать функцию непрерывно, вместо этого функция будет вызыватся с 
    задержкой delay ms, с последними переданными параметрами функции
    вызов функции до истечения delay приведет к обновлению переданных ранее параметров на новые.

    После выполнения оборачиваемой функции будет вызвана функция (callback) которую
    мы должны указать.

    вроде это - Debounce
*/

function low_update_decorator<T extends TanyFunc>(func: T, callback = () => {}, delay: number = 100) {
    let call_stack: ICallStackElement;
    let is_start: boolean = false;

    return function caller(...args: Parameters<T>): void {
        call_stack = { argum: args };

        if (is_start) {
            return;
        }

        const func_call = () => {
            let { argum } = call_stack as ICallStackElement; // трудоемкая процедура
            func(...argum);
            is_start = false;
            callback();
        };

        is_start = true; // выставляем флаг работы
        setTimeout(func_call, delay);
    };
}

/*
    декоратор для кеширования значений возвращаемых функциями.
*/
function cache_decorator<T extends TanyFunc, R extends ReturnType<T>>(func: T) {
    const ERR_RESPONSE = "!! decorators.is_cached: value not cached !!";
    const cache_v2 = new Map<string, R>();

    const get_cached = (args: Parameters<T>): typeof ERR_RESPONSE | R => {
        try {
            const calcKey = JSON.stringify(args);

            if (cache_v2.has(calcKey)) {
                return cache_v2.get(calcKey) as R;
            }
        } catch {
            // Если данные не сирализуемы
            return ERR_RESPONSE;
        }

        return ERR_RESPONSE;
    };

    return (...args: Parameters<T>) => {
        let result: R;
        let is_value_cache = get_cached(args);

        if (is_value_cache === ERR_RESPONSE) {
            result = func(...args);
            cache_v2.set(JSON.stringify(args), result);
        } else {
            result = is_value_cache;
        }

        return result;
    };
}

export { caller_delay_callback, first_caller_delay_callback, low_update_decorator, cache_decorator };
