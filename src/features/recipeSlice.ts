import { createSlice } from "@reduxjs/toolkit";
import { InitialRecipeState, MaterialState } from "../Types";

const initialState: InitialRecipeState = {
	isPublic: 0,
	recipeName: null,
	recipeImage: null,
	comment: null,
	serves: 0,
	materials: null,
	procedures: null,
};
const sortMaterialsByGroup = (materials: MaterialState[]) => {
	return [...materials].sort((a, b) => a.group - b.group);
};

export const recipeSlice = createSlice({
	name: "recipe",
	initialState,
	reducers: {
		setRecipeInfo: (state, action) => {
			const sortedMaterials = sortMaterialsByGroup(action.payload.materials);
			state.isPublic = action.payload.isPublic;
			state.recipeName = action.payload.recipeName;
			state.recipeImage = action.payload.recipeImage;
			state.comment = action.payload.comment;
			state.serves = action.payload.serves;
			state.materials = sortedMaterials;
			state.procedures = action.payload.procedures;
		},
	},
});

export const { setRecipeInfo } = recipeSlice.actions;
export default recipeSlice.reducer;

//initialStateかどうかを判定
export const isInitialState = (state: InitialRecipeState) => {
	return JSON.stringify(state) === JSON.stringify(initialState);
};
