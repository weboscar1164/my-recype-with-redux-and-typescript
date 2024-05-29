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
import { useAppDispatch } from "./app/hooks";
import { useFavorites } from "./app/firebaseHooks";

function App() {
	const dispatch = useAppDispatch();
	const {
		fetchFavorites,
		loading: loadingFavorites,
		error: errorFavorites,
	} = useFavorites();

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
						<Route path="/editrecipe" element={<EditRecipe />} />
						<Route path="/confirm" element={<Confirm />} />
						<Route path="/Recipe" element={<Recipe />} />
						<Route path="/" element={<RecipeList />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
