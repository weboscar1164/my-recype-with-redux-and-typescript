import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Role } from "../../Types";
import { useAppDispatch } from "./hooks";
import { db } from "../../firebase";
import { setError } from "../../features/pageStatusSlice";

export const useChangeUserRole = () => {
	const dispatch = useAppDispatch();

	const changeUserRole = async (uid: string, role: Role) => {
		try {
			const userRef = doc(db, "users", uid);

			await updateDoc(userRef, {
				role,
				updatedAt: serverTimestamp(),
			});

			console.log(`User role updated: ${uid} -> ${role}`);
		} catch (e) {
			dispatch(setError("ユーザー権限の変更に失敗しました。"));
			console.error(e);
			throw e;
		}
	};

	return { changeUserRole };
};
