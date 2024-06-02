import { db, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAppDispatch } from "./hooks";
import { setError, setLoading } from "../../features/loadingSlice";

export const useDeleteFirebaseDocument = () => {
	const dispatch = useAppDispatch();
	const deleteFirebaseDocument = async (
		recipeId: string,
		recipeImageUrl: string | null
	) => {
		dispatch(setLoading(true));
		try {
			// firestore上のrecipeを削除
			await deleteDoc(doc(db, "recipes", recipeId));

			// firebase storage上にimageがある場合は削除
			if (recipeImageUrl) {
				const desertRef = ref(storage, recipeImageUrl);
				await deleteObject(desertRef);
			}
		} catch (e: any) {
			dispatch(setError("レシピ削除時にエラーが発生しました。"));
			console.log(e);
		} finally {
			dispatch(setLoading(false));
		}
	};
	return { deleteFirebaseDocument };
};
