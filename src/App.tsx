import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.scss";
import Header from "./components/header/Header";
import Recipe from "./components/contents/Recipe";
import Navbar from "./components/Sidebar/Navbar";
import EditRecipe from "./components/contents/EditRecipe";
import Confirm from "./components/contents/Confirm";
import { login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import { useAppDispatch } from "./app/hooks";

function App() {
	const dispatch = useAppDispatch();

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
						<Route path="/" element={<Recipe />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
