import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/*
    типизирование стандартных хуков по рекомендации со оф.сайта
*/

const useAppStoreDispatch: () => AppDispatch = useDispatch;
const useAppStoreSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppStoreDispatch, useAppStoreSelector };
