import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "../store";

function store_middleware_logger(store: any) {
    return function (next: any) {
        return function (action: Action) {
            console.groupCollapsed(`New store action: ${action.type}`);
            console.log(action);
            console.groupEnd();

            next(action);
        };
    };
}

export { store_middleware_logger };
