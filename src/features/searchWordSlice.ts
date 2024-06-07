import { createSlice } from "@reduxjs/toolkit";

export const searchWordSlice = createSlice({
	name: "searchWord",
	initialState: "",
	reducers: {
		setSearchQuery: (state, action) => {
			return action.payload;
		},

		clearSearchQuery: (state) => {
			return "";
		},
	},
});

export const { setSearchQuery, clearSearchQuery } = searchWordSlice.actions;
export default searchWordSlice.reducer;
