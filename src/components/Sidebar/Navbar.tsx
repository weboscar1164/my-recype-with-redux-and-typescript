import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { resetRecipeInfo } from "../../features/recipeSlice";
import { clearSearchQuery } from "../../features/searchWordSlice";

type NavItem = {
	label: string;
	to: string;
	allow: ("guest" | "user" | "admin")[];
};

const NAV_ITEMS: NavItem[] = [
	{ label: "一覧", to: "/", allow: ["guest", "user", "admin"] },
	{ label: "レシピ作成", to: "/editRecipe", allow: ["user", "admin"] },
	{ label: "お気に入り", to: "/favorites", allow: ["user", "admin"] },
	{ label: "マイレシピ", to: "/myRecipe", allow: ["user", "admin"] },
	{ label: "管理ページ", to: "/admin", allow: ["admin"] },
];

const Navbar = () => {
	const user = useAppSelector((state) => state.user.user);
	const isAdmin = useAppSelector((state) => state.user.user?.role) === "admin";

	const dispatch = useAppDispatch();

	const [isOpen, setIsOpen] = useState(false);

	const handleNavToggle = () => {
		setIsOpen(!isOpen);
	};

	const role = user?.role ?? "guest";

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
						{NAV_ITEMS.map((item) => {
							const canAccess = item.allow.includes(role);
							return (
								<li key={item.to}>
									{canAccess ? (
										<Link
											className="navItem"
											to={item.to}
											onClick={onClickLink}
										>
											{item.label}
										</Link>
									) : (
										<span
											className="navItem navItemDisabled"
											title="ログインすると利用できます"
										>
											{item.label}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
