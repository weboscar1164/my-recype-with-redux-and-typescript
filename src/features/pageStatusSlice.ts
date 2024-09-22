import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
	isLoading: boolean;
	error: string | null;
	isAdminMode: boolean;
}

const initialState: LoadingState = {
	isLoading: false,
	error: null,
	isAdminMode: false,
};

const pageStatusSlice = createSlice({
	name: "loading",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setAdmin: (state, action: PayloadAction<boolean>) => {
			state.isAdminMode = action.payload;
		},
	},
});

export const { setLoading, setError, setAdmin } = pageStatusSlice.actions;
export default pageStatusSlice.reducer;
