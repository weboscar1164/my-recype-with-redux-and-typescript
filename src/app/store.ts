import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import recipeReducer from "../features/recipeSlice";
import favoritesReducer from "../features/favoritesSlice";
import loadingReducer from "../features/loadingSlice";
import searchWordReducer from "../features/searchWordSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		recipe: recipeReducer,
		favorites: favoritesReducer,
		loading: loadingReducer,
		searchWord: searchWordReducer,
	},
});

export type Appdispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
