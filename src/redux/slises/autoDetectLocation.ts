import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

// стейт состояния автомотического определения местоположения юзера
// в основном работает в связке с хуком useGeoLocation

interface IautoDetectLocationSlice {
    isPending: boolean; // флаг того что идет определение координат пользователя
    isSuccess: boolean; // флаг успешного определения координат
    isError: boolean; // флаг того что попытка определения координат закончилась ошибкой
    errorCode: number | null; // при ошибке, принимает код ошибки (1 - нету разрешений, 2 - внутрення ошибка, 3 - ошибка по таймауту, 4 - гелокация не поддерживается, 5 - ни одна из стадий определения (detectionStage) не завершилась успехом)
    detectionStage: number; // этап определения координат 0 - не определяется. 1 - определение с высокой точностью. 2 - еще раз определение с высокой точностью. 3 - определение с низкой точностью.
    nextStage: boolean; // разрешение на переход к следующиму detectionStage в случае ошибки, поумолчанию true, после начала определения локации сбрасывается на false. позволяет добится паузы между попытками определения города, для перехода на следующий шаг нужно перевести этот флаг в true
}

const initialState: IautoDetectLocationSlice = {
    isPending: false,
    isSuccess: false,
    isError: false,
    errorCode: null,
    detectionStage: 0,
    nextStage: true,
};

const autoDetectLocationSlice = createSlice({
    name: "autoDetectLocation",
    initialState: initialState,
    reducers: {
        setPending: (state, action: PayloadAction<boolean>) => {
            state.isPending = action.payload;
            state.isSuccess = false;
            state.isError = false;
            state.errorCode = null;
            state.nextStage = false;

            if (state.detectionStage <= 2) {
                state.detectionStage = state.detectionStage + 1;
            }
        },

        setSuccess: (state, action: PayloadAction<boolean>) => {
            state.isPending = false;
            state.isSuccess = action.payload;
            state.isError = false;
            state.errorCode = null;
            state.detectionStage = 0;
            state.nextStage = true;
        },

        setError: (state, action: PayloadAction<{ errorStatus: boolean; errorCode: number }>) => {
            state.isPending = false;
            state.isSuccess = false;
            state.isError = action.payload.errorStatus;
            state.errorCode = action.payload.errorCode;

            if (action.payload.errorCode !== 3) {
                state.detectionStage = 0;
                state.nextStage = true;
            }
        },

        resetError: (state, action: PayloadAction) => {
            state.isError = false;
            state.errorCode = null;
        },

        setDetectionStage: (state, action: PayloadAction<number>) => {
            state.detectionStage = action.payload;
        },

        setNextStage: (state, action: PayloadAction<boolean>) => {
            state.nextStage = action.payload;
        },
    },
});

const { setPending, setSuccess, setError, setNextStage, setDetectionStage, resetError } = autoDetectLocationSlice.actions;

export type { IautoDetectLocationSlice };
export default autoDetectLocationSlice.reducer;
export { setPending, setSuccess, setError, setNextStage, setDetectionStage, autoDetectLocationSlice, resetError };
