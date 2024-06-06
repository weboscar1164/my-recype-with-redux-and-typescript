import Searchbar from "./Searchbar";
import "./Header.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { crearFavorites } from "../../features/favoritesSlice";

import { Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Header = () => {
	const user = useAppSelector((state) => state.user.user);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const signIn = () => {
		signInWithPopup(auth, provider).catch((e) => {
			alert(e.message);
		});
	};

	const signOutConfirm = () => {
		if (confirm("ログアウトしますか？")) {
			auth.signOut();
			dispatch(crearFavorites());
			navigate("/");
		}
	};

	return (
		<div className="header">
			<h1>My Recipe</h1>
			<Searchbar />
			{user ? (
				<div className="userInfo" onClick={signOutConfirm}>
					<Tooltip title={user?.displayName}>
						<div className="userIcon">
							<img className="userIconLoggedin" src={user?.photo} alt="" />
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
	);
};

export default Header;
