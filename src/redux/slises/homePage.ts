import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React from "react";

interface IHomePageSlice {
    pageRef?: React.RefObject<HTMLElement>;
}

const initialState: IHomePageSlice = {
    pageRef: undefined,
};

const homePageSlice = createSlice({
    name: "homePage",
    initialState: initialState,
    reducers: {
        updatePageRef: (state, action: PayloadAction<React.RefObject<HTMLElement>>) => {
            return {
                ...state,
                pageRef: action.payload,
            };
        },
    },
});

const { updatePageRef } = homePageSlice.actions;

export type { IHomePageSlice };
export default homePageSlice.reducer;
export { updatePageRef, homePageSlice };
