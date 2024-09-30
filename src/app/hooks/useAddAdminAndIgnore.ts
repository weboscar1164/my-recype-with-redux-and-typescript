import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { setError } from "../../features/pageStatusSlice";

export const useAddAdminAndIgnore = () => {
	const dispatch = useAppDispatch();

	const addAdminAndIgnore = async (uid: string, action: string) => {
		try {
			// adminsコレクションにuIdをIDとしたドキュメントを作成
			const adminRef = doc(db, action, uid);
			await setDoc(adminRef, {});
			console.log(`${action} added`);
		} catch (e: unknown) {
			dispatch(setError("管理者権限追加時にエラーが発生しました。"));
			console.log(e);
		} finally {
		}
	};

	return { addAdminAndIgnore };
};
