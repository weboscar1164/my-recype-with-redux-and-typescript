import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { User } from "../../Types";
import { setLoading } from "../../features/pageStatusSlice";

export const useRegistUser = () => {
	const dispatch = useAppDispatch();
	// const user: User =
	const registUser = async (loginUser: User | null) => {
		if (loginUser === null) {
			console.error("User is not logged in or user data is not available");
			return;
		}

		dispatch(setLoading(true));
		try {
			// usersコレクションのドキュメントリファレンスを取得
			const userRef = doc(db, "users", loginUser.uid);
			// usersコレクションのドキュメントリファレンスを取得
			const userDoc = await getDoc(userRef);

			if (!userDoc.exists()) {
				// usersコレクションに新しいユーザーを追加
				await setDoc(userRef, {});

				console.log("User added to users collection with ID: ", loginUser.uid);
			}
			// userのサブクエリuserInfoに追加
			const userInfoRef = doc(
				db,
				"users",
				loginUser.uid,
				"userInfo",
				loginUser.uid
			);

			// userのサブコレクションuserInfoのドキュメントリファレンスを取得
			const userInfoDoc = await getDoc(userInfoRef);

			if (userInfoDoc.exists()) {
				console.log("User info already exists");
				return;
			}

			// userInfoが存在しない場合、新しいドキュメントを追加
			await setDoc(userInfoRef, {
				uid: loginUser.uid,
				photoURL: loginUser.photoURL,
				email: loginUser.email,
				displayName: loginUser.displayName,
			});

			console.log("User info added with ID: ", loginUser.uid);
		} catch (e) {
			console.error(e);
		} finally {
			dispatch(setLoading(false));
		}
	};
	return { registUser };
};
