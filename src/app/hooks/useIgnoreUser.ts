import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { setError } from "../../features/pageStatusSlice";

export const useIgnoreUser = () => {
	const dispatch = useAppDispatch();

	const addIgnores = async (uid: string) => {
		try {
			await setDoc(doc(db, "ignores", uid), {
				createdAt: new Date(),
			});
		} catch (e) {
			dispatch(setError("使用制限の追加に失敗しました。"));
			throw e;
		}
	};

	const removeIgnores = async (uid: string) => {
		try {
			await deleteDoc(doc(db, "ignores", uid));
		} catch (e) {
			dispatch(setError("使用制限の解除に失敗しました。"));
			throw e;
		}
	};
	return {
		addIgnores,
		removeIgnores,
	};
};
