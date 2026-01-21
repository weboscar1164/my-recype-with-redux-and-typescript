import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { AuthUser, User } from "../../Types";
import { doc, getDoc } from "firebase/firestore";
import { useRegistUser } from "./useRegistUser";
import { openPopup } from "../../features/popupSlice";
import { useAppDispatch } from "./hooks";
import { setError } from "../../features/pageStatusSlice";

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
				const loginUserBase: AuthUser = {
					uid: result.user.uid,
					photoURL: result.user.photoURL,
					email: result.user.email,
					displayName: result.user.displayName,
				};

				/** Firestoreから role を取得 */
				const userRef = doc(db, "users", result.user.uid);
				const userDoc = await getDoc(userRef);

				if (!userDoc.exists()) {
					// 初回ログイン　→ guest 作成
					await registUser(loginUserBase);
				}

				const latestUserDoc = await getDoc(userRef);
				const role = latestUserDoc.exists()
					? latestUserDoc.data().role
					: "guest";
				const loginUser: User = {
					...loginUserBase,
					role,
				};
				console.log("Login successful: ", loginUser);

				dispatch(
					openPopup({ message: "ログインしました。", action: "success" })
				);
				dispatch(setError(null));
			} else {
				throw new Error("No user infomation found after sign-in");
			}
		} catch (e: any) {
			alert(e.message);
		}
	};
	return { signIn };
};
