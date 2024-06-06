import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.scss";
import Header from "./components/header/Header";
import Recipe from "./components/contents/Recipe";
import RecipeList from "./components/contents/RecipeList";
import Navbar from "./components/Sidebar/Navbar";
import EditRecipe from "./components/contents/EditRecipe";
import Confirm from "./components/contents/Confirm";
import { login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import { useAppDispatch, useAppSelector } from "./app/hooks/hooks";
import { useFavorites } from "./app/hooks/hooks";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	const dispatch = useAppDispatch();
	const { fetchFavorites } = useFavorites();

	const isLoading = useAppSelector((state) => state.loading.isLoading);
	const Error = useAppSelector((state) => state.loading.error);

	useEffect(() => {
		auth.onAuthStateChanged((loginUser) => {
			// console.log(loginUser);
			if (loginUser) {
				dispatch(
					login({
						uid: loginUser.uid,
						photo: loginUser.photoURL,
						email: loginUser.email,
						displayName: loginUser.displayName,
					})
				);
				fetchFavorites(loginUser.uid);
			} else {
				dispatch(logout());
			}
		});
	}, [dispatch]);

	return (
		<div className="app">
			<Router>
				<Header></Header>
				<Navbar></Navbar>
				<div className="contents">
					<Routes>
						<Route
							path="/editrecipe"
							element={
								<ProtectedRoute>
									<EditRecipe />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/confirm"
							element={
								<ProtectedRoute>
									<Confirm />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/Recipe"
							element={
								<ProtectedRoute>
									<Recipe />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/favorites"
							element={
								<ProtectedRoute>
									<RecipeList showFavorites={true} />
								</ProtectedRoute>
							}
						/>
						<Route path="/" element={<RecipeList showFavorites={false} />} />
					</Routes>
				</div>
				{isLoading && <Loading />}
			</Router>
		</div>
	);
}

export default App;
