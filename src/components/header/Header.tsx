import Searchbar from "./Searchbar";
import "./Header.scss";
import {
	useAppDispatch,
	useAppSelector,
	useSignIn,
} from "../../app/hooks/hooks";
import { clearFavorites } from "../../features/favoritesSlice";
import { Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { openModal, resetModal } from "../../features/modalSlice";
import { useEffect, useState } from "react";
import { openPopup } from "../../features/popupSlice";
import { setError } from "../../features/pageStatusSlice";
import { resetRecipeInfo } from "../../features/recipeSlice";
import { clearSearchQuery } from "../../features/searchWordSlice";

const Header = () => {
	const user = useAppSelector((state) => state.user.user);
	const modalState = useAppSelector((state) => state.modal);
	const [confirmAction, setConfirmAction] = useState<"logout" | null>(null);
	const { signIn } = useSignIn();

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const signOutConfirm = () => {
		const confirmMessage = "ログアウトしますか？";
		setConfirmAction("logout");

		dispatch(
			openModal({
				message: confirmMessage,
			}),
		);
	};
	// modalにおいてログアウト選択時の処理
	useEffect(() => {
		const handleLogout = async () => {
			if (modalState.confirmed !== null && confirmAction !== null) {
				if (modalState.confirmed && confirmAction === "logout") {
					await auth.signOut();
					dispatch(clearFavorites());
					dispatch(
						openPopup({ message: "ログアウトしました。", action: "success" }),
					);
					setConfirmAction(null);
					dispatch(setError(null));
					navigate("/");
				}
			}
			dispatch(resetModal());
		};
		handleLogout();
	}, [modalState.confirmed]);

	const onClickLink = () => {
		dispatch(resetRecipeInfo());
		dispatch(clearSearchQuery());
	};

	return (
		<div className="header">
			<div className="headerContainer">
				<h1 className="headerLogo">
					<Link to={"/"} onClick={onClickLink}>
						<img
							className="headerLogoPc"
							src="my_recipe_logo.png"
							alt="my recipe"
						/>
						<img
							className="headerLogoSp"
							src="my_recipe_logo_header.png"
							alt="my recipe"
						/>
					</Link>
				</h1>
				<Searchbar />
				{user ? (
					<div className="userInfo" onClick={signOutConfirm}>
						<Tooltip title={user?.displayName}>
							<div className="userIconWrapper">
								<div className="userIcon">
									<img
										className="userIconLoggedin"
										src={user?.photoURL}
										alt=""
									/>
								</div>
								{user.role !== "user" && (
									<div className="userIconAdmin">{user.role}</div>
								)}
							</div>
						</Tooltip>
						<Tooltip title="ログアウト">
							<LogoutIcon className="userActionIcon" />
						</Tooltip>
					</div>
				) : (
					<Tooltip title="ログイン">
						<div className="userInfo" onClick={signIn}>
							<div className="userIcon">
								<img className="userIconDefault" src="icon_user.svg" alt="" />
							</div>
							<LoginIcon className="userActionIcon" />
						</div>
					</Tooltip>
				)}
			</div>
		</div>
	);
};

export default Header;
