import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { resetRecipeInfo } from "../../features/recipeSlice";

const Navbar = () => {
	const user = useAppSelector((state) => state.user.user);

	const dispatch = useAppDispatch();

	const [isOpen, setIsOpen] = useState(false);

	const handleNavToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleToEditRecipe = () => {
		dispatch(resetRecipeInfo());
		handleNavToggle();
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
					{user?.uid && (
						<>
							<li>
								<Link
									className="navItem"
									to={"/editRecipe"}
									onClick={handleToEditRecipe}
								>
									投稿
								</Link>
							</li>
							<li>
								<Link
									className="navItem"
									to={"/favorites"}
									onClick={handleNavToggle}
								>
									お気に入り
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
