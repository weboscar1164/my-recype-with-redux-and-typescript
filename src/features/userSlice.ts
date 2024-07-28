import { createSlice } from "@reduxjs/toolkit";
import { InitialUserState } from "../Types";

const initialState: InitialUserState = {
	user: null,
	isAdmin: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, action) => {
			state.user = action.payload.user;
			state.isAdmin = action.payload.isAdmin;
		},

		logout: (state) => {
			state.user = null;
			state.isAdmin = false;
		},
	},
});
// console.log(userSlice);

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
