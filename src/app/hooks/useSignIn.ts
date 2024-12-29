import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { User } from "../../Types";
import { doc, getDoc } from "firebase/firestore";
import { useRegistUser } from "./useRegistUser";
import { openPopup } from "../../features/popupSlice";
import { useAppDispatch } from "./hooks";

export const useSignIn = () => {
	const dispatch = useAppDispatch();
	const { registUser } = useRegistUser();

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
	return { signIn };
};
