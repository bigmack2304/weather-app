import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

interface IHomePageSlice {
    pageSelector?: string; // DEPRICATED. css селектор home страницы
    backgroundClass?: string; // содержит в себе класс который будет применен как дополнительный к home странице
}

const initialState: IHomePageSlice = {
    pageSelector: undefined,
    backgroundClass: undefined,
};

const homePageSlice = createSlice({
    name: "homePage",
    initialState: initialState,
    reducers: {
        updatePageSelector: (state, action: PayloadAction<string>) => {
            state.pageSelector = action.payload;
        },
        updateBackgroundClass: (state, action: PayloadAction<string>) => {
            state.backgroundClass = action.payload;
        },
    },
});

const { updatePageSelector, updateBackgroundClass } = homePageSlice.actions;

export type { IHomePageSlice };
export default homePageSlice.reducer;
export { updatePageSelector, homePageSlice, updateBackgroundClass };
