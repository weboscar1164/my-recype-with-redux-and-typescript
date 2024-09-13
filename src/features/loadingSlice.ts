import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
	isLoading: boolean;
	error: string | null;
}

const initialState: LoadingState = {
	isLoading: false,
	error: null,
};

const loadingSlice = createSlice({
	name: "loading",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setLoading, setError } = loadingSlice.actions;
export default loadingSlice.reducer;
