import { createSlice } from "@reduxjs/toolkit";

export const searchWordSlice = createSlice({
	name: "searchWord",
	initialState: "",
	reducers: {
		setSearchQuery: (_state, action) => {
			return action.payload;
		},

		clearSearchQuery: (_state) => {
			return "";
		},
	},
});

export const { setSearchQuery, clearSearchQuery } = searchWordSlice.actions;
export default searchWordSlice.reducer;
