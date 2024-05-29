import { createSlice } from "@reduxjs/toolkit";
import { FavoriteState } from "../Types";

const initialState: FavoriteState[] = [];

export const recipeSlice = createSlice({
	name: "favorites",
	initialState,
	reducers: {
		setFavorites: (state, action) => action.payload,
		addFavorite: (state, action) => {
			console.log(action.payload);
			const { recipeId, recipeName, createdAt } = action.payload;
			console.log({ recipeId, recipeName, createdAt });
			state.push({
				recipeId,
				recipeName,
				createdAt,
			});
		},
		removeFavorite: (state, action) => {
			console.log(action.payload);
			return state.filter((favorite) => favorite.recipeId !== action.payload);
		},
		crearFavorites: () => initialState,
	},
});

export const { setFavorites, addFavorite, removeFavorite, crearFavorites } =
	recipeSlice.actions;
export default recipeSlice.reducer;
