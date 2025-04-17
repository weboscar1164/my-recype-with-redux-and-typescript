import { createSlice } from "@reduxjs/toolkit";
import { InitialRecipeState, MaterialState } from "../Types";

const initialState: InitialRecipeState = {
	isPublic: 0,
	recipeName: null,
	recipeImageUrl: null,
	comment: null,
	serves: 0,
	materials: null,
	procedures: null,
	recipeId: "",
	user: "",
	userDisplayName: "",
	favoriteCount: 0,
};
const sortMaterialsByGroup = (materials: MaterialState[]) => {
	// 材料をグループごとにまとめる
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
			state.tags = action.payload.tags;
			state.recipeImageUrl = action.payload.recipeImageUrl;
			state.comment = action.payload.comment;
			state.serves = action.payload.serves;
			state.materials = sortedMaterials;
			state.procedures = action.payload.procedures;
			state.recipeId = action.payload.recipeId;
			state.favoriteCount = action.payload.favoriteCount;
			state.user = action.payload.user;
			state.userDisplayName = action.payload.userDisplayName;
		},

		setFavoriteCount: (state, action) => {
			state.favoriteCount = action.payload;
		},

		resetRecipeInfo: () => initialState,
	},
});

export const { setRecipeInfo, setFavoriteCount, resetRecipeInfo } =
	recipeSlice.actions;
export default recipeSlice.reducer;

//initialStateかどうかを判定
export const isInitialState = (state: InitialRecipeState) => {
	return JSON.stringify(state) === JSON.stringify(initialState);
};
