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
import { useNavigate } from "react-router-dom";
import { openModal, resetModal } from "../../features/modalSlice";
import { useEffect } from "react";
import { openPopup } from "../../features/popupSlice";
import { setError } from "../../features/pageStatusSlice";

const Header = () => {
	const user = useAppSelector((state) => state.user.user);
	const isAdmin = useAppSelector((state) => state.user.isAdmin);
	const modalState = useAppSelector((state) => state.modal);
	const { signIn } = useSignIn();

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const signOutConfirm = () => {
		const confirmMessage = "ログアウトしますか？";

		dispatch(
			openModal({
				message: confirmMessage,
				action: "logout",
			})
		);
	};

	// modalにおいてログアウト選択時の処理
	useEffect(() => {
		const handleLogout = async () => {
			if (modalState.confirmed !== null && modalState.action === "logout") {
				if (modalState.confirmed) {
					await auth.signOut();
					dispatch(clearFavorites());
					dispatch(
						openPopup({ message: "ログアウトしました。", action: "success" })
					);
					dispatch(setError(null));
					navigate("/");
				}
			}
			dispatch(resetModal());
		};
		handleLogout();
	}, [modalState.confirmed]);

	return (
		<div className="header">
			<div className="headerContainer">
				<h1>
					My <br className="brSmActive" /> Recipe
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
								{isAdmin && <div className="userIconAdmin">admin</div>}
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
