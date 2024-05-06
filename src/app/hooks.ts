import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { Appdispatch, RootState } from "./store";
import { useSelector } from "react-redux";

export const useAppDispatch: () => Appdispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
