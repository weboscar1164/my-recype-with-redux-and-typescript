import { useState } from "react";
import "./App.scss";
import Header from "./components/header/Header";
import Recipe from "./components/contents/Recipe";
import Navbar from "./components/Sidebar/Navbar";
import EditRecipe from "./components/contents/EditRecipe";

function App() {
	return (
		<div className="app">
			<Header></Header>
			<Navbar></Navbar>
			<div className="contents">
				<Recipe />
				{/* <EditRecipe /> */}
			</div>
		</div>
	);
}

export default App;
