import type { Action, Dispatch, PayloadAction, MiddlewareAPI } from "@reduxjs/toolkit";
import type { IautoDetectLocationSlice } from "../slises/autoDetectLocation";
import { AppDispatch, RootState, store } from "../store";

function isIautoDetectLocation(action: Action): action is PayloadAction<IautoDetectLocationSlice> {
    return action.type == "autoDetectLocation/setPending";
}

function autoDetectLocation_pending_middleware(store: MiddlewareAPI) {
    return function (next: Dispatch) {
        return function (action: Action) {
            let autoDetectLocationSlice = (store.getState() as RootState).autoDetectLocation;
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
