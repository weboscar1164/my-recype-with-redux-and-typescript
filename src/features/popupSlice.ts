import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Popup } from "../Types";

const initialState: Popup = {
	isOpen: false,
	message: "",
	action: "",
};

export const popupSlice = createSlice({
	name: "popup",
	initialState,
	reducers: {
		openPopup(
			state,
			action: PayloadAction<{
				message: string;
				action: "success" | "notice" | "";
			}>
		) {
			state.isOpen = true;
			state.message = action.payload.message;
			state.action = action.payload.action;
		},

		closePopup(state) {
			state.isOpen = false;
			setTimeout(() => {
				(state.message = ""), (state.action = "");
			});
		},
	},
});

export const { openPopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;
