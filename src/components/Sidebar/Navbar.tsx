import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Navbar.scss";
import { Link } from "react-router-dom";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleNavToggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={`navbar ${isOpen ? "navbarOpen" : ""}`}>
			<div
				className={`navToggleIcon ${isOpen ? "navToggleIconOpen" : ""}`}
				onClick={handleNavToggle}
			>
				<ArrowForwardIosIcon />
			</div>
			<nav className="navList">
				<ul>
					<li>
						<Link className="navItem" to={"/"} onClick={handleNavToggle}>
							一覧
						</Link>
					</li>
					<li>
						<Link
							className="navItem"
							to={"/editRecipe"}
							onClick={handleNavToggle}
						>
							投稿
						</Link>
					</li>
					<li>
						<Link className="navItem" to={"/"} onClick={handleNavToggle}>
							お気に入り
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
