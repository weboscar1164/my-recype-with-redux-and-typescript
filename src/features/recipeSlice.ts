import { createSlice } from "@reduxjs/toolkit";
import { InitialRecipeState } from "../Types";

const initialState: InitialRecipeState = {
	recipeName: null,
	recipeImage: null,
	comment: null,
	serves: 0,
	material: null,
	procedure: null,
};

export const recipeSlice = createSlice({
	name: "recipe",
	initialState,
	reducers: {
		setRecipeInfo: (state, action) => {
			state.recipeName = action.payload.recipeName;
			state.recipeImage = action.payload.recipeImage;
			state.comment = action.payload.comment;
			state.serves = action.payload.serves;
			state.material = action.payload.material;
			state.procedure = action.payload.procedure;
		},
	},
});

export const { setRecipeInfo } = recipeSlice.actions;
export default recipeSlice.reducer;
