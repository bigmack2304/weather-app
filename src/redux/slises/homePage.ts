import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

interface IHomePageSlice {
    pageSelector?: string;
}

const initialState: IHomePageSlice = {
    pageSelector: undefined,
};

const homePageSlice = createSlice({
    name: "homePage",
    initialState: initialState,
    reducers: {
        updatePageSelector: (state, action: PayloadAction<string>) => {
            state.pageSelector = action.payload;
        },
    },
});

const { updatePageSelector } = homePageSlice.actions;

export type { IHomePageSlice };
export default homePageSlice.reducer;
export { updatePageSelector, homePageSlice };
