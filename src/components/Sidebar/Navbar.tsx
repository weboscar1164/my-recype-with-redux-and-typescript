import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { resetRecipeInfo } from "../../features/recipeSlice";
import { clearSearchQuery } from "../../features/searchWordSlice";

const Navbar = () => {
	const user = useAppSelector((state) => state.user.user);
	const isAdmin = useAppSelector((state) => state.user.isAdmin);

	const dispatch = useAppDispatch();

	const [isOpen, setIsOpen] = useState(false);

	const handleNavToggle = () => {
		setIsOpen(!isOpen);
	};

	const onClickLink = () => {
		dispatch(resetRecipeInfo());
		dispatch(clearSearchQuery());
		handleNavToggle();
	};

	return (
		<div className="navbar">
			<div
				className={`navbarBackground ${isOpen ? "navbarBackgroundOpen" : ""}`}
				onClick={handleNavToggle}
			></div>
			<div className={`navbarContainer ${isOpen ? "navbarContainerOpen" : ""}`}>
				<div
					className={`navToggleIcon ${isOpen ? "navToggleIconOpen" : ""}`}
					onClick={handleNavToggle}
				>
					<ArrowForwardIosIcon />
				</div>
				<nav className="navList">
					<ul>
						<li>
							<Link className="navItem" to={"/"} onClick={onClickLink}>
								一覧
							</Link>
						</li>
						{user?.uid && (
							<>
								<li>
									<Link
										className="navItem"
										to={"/editRecipe"}
										onClick={onClickLink}
									>
										投稿
									</Link>
								</li>
								<li>
									<Link
										className="navItem"
										to={"/favorites"}
										onClick={onClickLink}
									>
										お気に入り
									</Link>
								</li>
								<li>
									<Link
										className="navItem"
										to={"/myRecipe"}
										onClick={onClickLink}
									>
										マイレシピ
									</Link>
								</li>
								{isAdmin && (
									<li>
										<Link
											className="navItem"
											to={"/admin"}
											onClick={onClickLink}
										>
											管理ページ
										</Link>
									</li>
								)}
							</>
						)}
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
