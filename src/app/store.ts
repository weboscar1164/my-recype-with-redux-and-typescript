import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "../features/userSlice";
import recipeReducer from "../features/recipeSlice";
import favoritesReducer from "../features/favoritesSlice";
import pageStatusReducer from "../features/pageStatusSlice";
import searchWordReducer from "../features/searchWordSlice";
import modalReducer from "../features/modalSlice";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["user", "recipe", "pageStatus"],
};

const rootReducer = combineReducers({
	user: userReducer,
	recipe: recipeReducer,
	favorites: favoritesReducer,
	pageStatus: pageStatusReducer,
	searchWord: searchWordReducer,
	modal: modalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
});

// RootState 型を定義
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 型も定義
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
