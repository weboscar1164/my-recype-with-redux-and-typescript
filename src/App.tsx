import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import Header from "./components/header/Header";
import Recipe from "./components/contents/Recipe";
import Navbar from "./components/Sidebar/Navbar";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="app">
			<Navbar></Navbar>
			<div className="contents">
				<Header></Header>
				<Recipe></Recipe>
			</div>
		</div>
	);
}

export default App;
