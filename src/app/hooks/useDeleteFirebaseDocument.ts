import { db, storage } from "../../firebase";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAppDispatch } from "./hooks";
import { setError, setLoading } from "../../features/pageStatusSlice";
import { recipeCountDoun } from "../../features/userSlice";

export const useDeleteFirebaseDocument = () => {
	const dispatch = useAppDispatch();

	const deleteFirebaseDocument = async (
		recipeId: string,
		user: string,
		recipeImageUrl: string | null,
	) => {
		if (!user) {
			dispatch(setError("ユーザーが認証されていません。"));
			return;
		}
		dispatch(setLoading(true));
		try {
			// userのrecipeCountをディクリメント
			await updateDoc(doc(db, "users", user), {
				recipeCount: increment(-1),
			});

			// firestore上のrecipeを削除
			await deleteDoc(doc(db, "recipes", recipeId));

			// firebase storage上にimageがある場合は削除
			if (recipeImageUrl) {
				const desertRef = ref(storage, recipeImageUrl);
				await deleteObject(desertRef);
			}
			dispatch(recipeCountDoun());
		} catch (e: any) {
			dispatch(setError("レシピ削除時にエラーが発生しました。"));
			console.log(e);
		} finally {
			dispatch(setLoading(false));
		}
	};
	return { deleteFirebaseDocument };
};
