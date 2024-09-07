import { db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useAppDispatch } from "./hooks";
import { setError, setLoading } from "../../features/loadingSlice";

export const useDeleteAdminAndIgnore = () => {
	const dispatch = useAppDispatch();
	const deleteAdminAndIgnore = async (uid: string, action: string) => {
		dispatch(setLoading(true));
		try {
			// firestore上のrecipeを削除
			await deleteDoc(doc(db, action, uid));
			console.log(action, " deleted");
		} catch (e: any) {
			dispatch(setError("管理者権限削除時にエラーが発生しました。"));
			console.log(e);
		} finally {
			dispatch(setLoading(false));
		}
	};
	return { deleteAdminAndIgnore };
};
