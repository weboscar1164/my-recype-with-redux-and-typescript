import { useEffect, useState } from "react";
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
			console.log(loginUser);
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
			<Header></Header>
			<Navbar></Navbar>
			<div className="contents">
				{/* <Recipe /> */}
				<EditRecipe />
				{/* <Confirm /> */}
			</div>
		</div>
	);
}

export default App;
