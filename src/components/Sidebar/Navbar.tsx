import { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import {
	useAppDispatch,
	useAppSelector,
	useSignIn,
} from "../../app/hooks/hooks";
import { resetRecipeInfo } from "../../features/recipeSlice";
import { clearSearchQuery } from "../../features/searchWordSlice";
import { openModal, resetModal } from "../../features/modalSlice";
import { openPopup } from "../../features/popupSlice";

type NavItem = {
	label: string;
	to: string;
	allow: ("guest" | "user" | "admin")[];
};

const NAV_ITEMS: NavItem[] = [
	{ label: "お気に入り", to: "/favorites", allow: ["user", "admin", "guest"] },
	{ label: "レシピ作成", to: "/editRecipe", allow: ["user", "admin", "guest"] },
	{ label: "マイレシピ", to: "/myRecipe", allow: ["user", "admin", "guest"] },
];

const Navbar = () => {
	const user = useAppSelector((state) => state.user.user);
	const modalState = useAppSelector((state) => state.modal);
	const { signIn } = useSignIn();

	const dispatch = useAppDispatch();

	const [isOpen, setIsOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<string | null>(null);

	useEffect(() => {
		// ログインモーダルの確認処理
		const handleLogin = async () => {
			if (modalState.confirmed !== null && confirmAction === "login") {
				if (modalState.confirmed) {
					signIn();
				}
			}
			dispatch(resetModal());
			setConfirmAction(null);
		};
		handleLogin();
	}, [modalState.confirmed]);

	const handleNavToggle = () => {
		setIsOpen(!isOpen);
	};

	const role = user?.role ?? "guest";

	const isLoggedIn = !!user;

	const onClickLink = () => {
		dispatch(resetRecipeInfo());
		dispatch(clearSearchQuery());
		handleNavToggle();
	};

	const onClickDisabled = (isLoggedIn: boolean) => {
		if (!isLoggedIn) {
			setConfirmAction("login");
			dispatch(
				openModal({
					message: "ログインが必要です。ログインしますか？",
				}),
			);
		} else {
			dispatch(
				openPopup({
					message: `現在「ゲスト」としてログインしています。認証されることで使用できます。`,
					action: "success",
				}),
			);
		}
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
							<Link className="navItem" to="/" onClick={onClickLink}>
								メインページ
							</Link>
						</li>
						{NAV_ITEMS.map((item) => {
							const canAccess = item.allow.includes(role);
							const distabledMessage = !isLoggedIn
								? "ログインが必要です。"
								: "";
							return (
								<li key={item.to}>
									{canAccess && isLoggedIn ? (
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
											title={distabledMessage}
											onClick={() => onClickDisabled(isLoggedIn)}
										>
											{item.label}
										</span>
									)}
								</li>
							);
						})}
						{role === "admin" && (
							<li>
								<Link className="navItem" to="/admin" onClick={onClickLink}>
									管理ページ
								</Link>
							</li>
						)}
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
