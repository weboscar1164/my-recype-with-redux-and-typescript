import Searchbar from "./Searchbar";
import "./Header.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { clearFavorites } from "../../features/favoritesSlice";
import { Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useRegistUser } from "../../app/hooks/useRegistUser";
import { User } from "../../Types";
import { doc, getDoc } from "firebase/firestore";
import { openModal, resetModal } from "../../features/modalSlice";
import { useEffect } from "react";
import { openPopup } from "../../features/popupSlice";

const Header = () => {
	const user = useAppSelector((state) => state.user.user);
	const isAdmin = useAppSelector((state) => state.user.isAdmin);
	const modalState = useAppSelector((state) => state.modal);
	const { registUser } = useRegistUser();

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const signIn = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			if (result.user) {
				if (
					!result.user.email ||
					!result.user.displayName ||
					!result.user.photoURL
				) {
					throw new Error("Missing user information after sign-in");
				}
				const loginUser: User = {
					uid: result.user.uid,
					photoURL: result.user.photoURL,
					email: result.user.email,
					displayName: result.user.displayName,
				};
				console.log("Login successful: ", loginUser);
				const userInfoDoc = await getDoc(
					doc(db, "users", loginUser.uid, "userInfo", loginUser.uid)
				);
				// console.log(loginUser);
				if (!userInfoDoc.exists()) {
					await registUser(loginUser);
				}
				dispatch(
					openPopup({ message: "ログインしました。", action: "success" })
				);
			} else {
				throw new Error("No user infomation found after sign-in");
			}
		} catch (e: any) {
			alert(e.message);
		}
	};

	const signOutConfirm = () => {
		const confirmMessage = "ログアウトしますか？";

		dispatch(
			openModal({
				message: confirmMessage,
				action: "logout",
			})
		);
	};

	useEffect(() => {
		const handleLogout = async () => {
			if (modalState.confirmed !== null && modalState.action === "logout") {
				if (modalState.confirmed) {
					await auth.signOut();
					dispatch(clearFavorites());
					dispatch(
						openPopup({ message: "ログアウトしました。", action: "success" })
					);
					navigate("/");
				}
			}
			dispatch(resetModal());
		};
		handleLogout();
	}, [modalState.confirmed]);

	return (
		<div className="header">
			<h1>My Recipe</h1>
			<Searchbar />
			{user ? (
				<div className="userInfo" onClick={signOutConfirm}>
					<Tooltip title={user?.displayName}>
						<div className="userIconWrapper">
							<div className="userIcon">
								<img className="userIconLoggedin" src={user?.photoURL} alt="" />
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
	);
};

export default Header;
