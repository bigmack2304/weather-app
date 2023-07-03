import type { Action } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IautoDetectLocationSlice } from "../slises/autoDetectLocation";
import { RootState, store } from "../store";

function isIautoDetectLocation(action: Action): action is PayloadAction<IautoDetectLocationSlice> {
    return action.type == "autoDetectLocation/setPending";
}

function autoDetectLocation_pending_middleware(store: any) {
    return function (next: any) {
        return function (action: Action) {
            let autoDetectLocationSlice = (store.getState() as RootState).autoDetectLocation;
            // debugger;
            if (isIautoDetectLocation(action)) {
                if (!autoDetectLocationSlice.nextStage) {
                    return;
                }
            }

            next(action);
        };
    };
}

export { autoDetectLocation_pending_middleware };
