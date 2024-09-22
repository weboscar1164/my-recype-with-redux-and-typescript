import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfirmModal } from "../Types";

const initialState: ConfirmModal = {
	message: "",
	isOpen: false,
	action: "",
	confirmed: null,
};

export const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		openModal(
			state,
			action: PayloadAction<{
				message: string;
				action: "admins" | "ignores" | "logout" | "deleteRecipe" | "";
			}>
		) {
			state.isOpen = true;
			state.message = action.payload.message;
			state.action = action.payload.action;
		},

		closeModal(state) {
			state.isOpen = false;
			state.message = "";
			state.action = "";
			state.confirmed = null;
		},

		confirmModal(state) {
			state.confirmed = true; // 確認されたとき
			state.isOpen = false;
		},
		cancelModal(state) {
			state.confirmed = false; // キャンセルされたとき
			state.isOpen = false;
		},
		resetModal(state) {
			state.confirmed = null;
		},
	},
});

export const { openModal, closeModal, confirmModal, cancelModal, resetModal } =
	modalSlice.actions;
export default modalSlice.reducer;
