import { createSlice } from "@reduxjs/toolkit";
import { InitialUserState } from "../Types";

const initialState: InitialUserState = {
	user: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, action) => {
			state.user = action.payload.user;
		},

		logout: (state) => {
			state.user = null;
		},
		recipeCountUp: (state) => {
			if (state.user) {
				state.user.recipeCount += 1;
			}
		},
		recipeCountDoun: (state) => {
			if (state.user && state.user.recipeCount > 0) {
				state.user.recipeCount -= 1;
			}
		},
	},
});

export const { login, logout, recipeCountUp, recipeCountDoun } =
	userSlice.actions;
export default userSlice.reducer;
