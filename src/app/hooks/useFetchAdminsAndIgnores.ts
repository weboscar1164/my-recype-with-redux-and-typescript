import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { setError, setLoading } from "../../features/loadingSlice";

export const useFetchAdminsAndIgnores = () => {
	const dispatch = useAppDispatch();

	const fetchAdminsAndIgnores = async (action: string) => {
		dispatch(setLoading(true));
		try {
			const actionRef = collection(db, action);
			const snapshot = await getDocs(actionRef);
			const actionsUIDs = snapshot.docs.map((doc) => doc.id);
			console.log(actionsUIDs);
			return actionsUIDs;
		} catch (e: any) {
			dispatch(setError("管理者権限取得時にエラーが発生しました。"));
			console.log(e);
		} finally {
			dispatch(setLoading(false));
		}
	};

	return { fetchAdminsAndIgnores };
};
