import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import recipeReducer from "../features/recipeSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,

		recipe: recipeReducer,
	},
});

export type Appdispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
