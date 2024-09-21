import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { useFetchFavorites } from "./useFetchFavorites";
export { useAddFavorite } from "./useAddFavorite";
export { useDeleteFavorite } from "./useDeleteFavorite";
export { useDeleteFirebaseDocument } from "./useDeleteFirebaseDocument";
export { useGetRecipeList } from "./useGetRecipeList";
export { useFetchAdminsAndIgnores } from "./useFetchAdminsAndIgnores";
export { useAddAdminAndIgnore } from "./useAddAdminAndIgnore";
export { useDeleteAdminAndIgnore } from "./useDeleteAdminAndIgnore";
export { usePagination } from "./usePagination";
export { useFetchUsers } from "./useFetchUsers";
