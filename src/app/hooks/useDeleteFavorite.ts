import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	increment,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { removeFavorite } from "../../features/favoritesSlice";
import { setFavoriteCount } from "../../features/recipeSlice";
import { setError, setLoading } from "../../features/loadingSlice";

export const useDeleteFavorite = () => {
	const dispatch = useAppDispatch();

	const deleteFavoriteAsync = async (userId: string, recipeId: string) => {
		// dispatch(setLoading(true));
		try {
			const favoritesRef = collection(db, "users", userId, "favorites");
			const q = query(favoritesRef, where("recipeId", "==", recipeId));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach(async (docSnapshot) => {
				const favoriteDoc = doc(
					db,
					"users",
					userId,
					"favorites",
					docSnapshot.id
				);
				await deleteDoc(favoriteDoc);
				dispatch(removeFavorite(recipeId));

				// recipeのfavoritCountをデクリメント
				const recipeRef = doc(db, "recipes", recipeId);
				await updateDoc(recipeRef, {
					favoriteCount: increment(-1),
				});

				const recipeDocSnapshot: any = await getDoc(recipeRef);
				const favoriteCount = recipeDocSnapshot.data().favoriteCount;

				dispatch(setFavoriteCount(favoriteCount));
			});
		} catch (e: any) {
			dispatch(setError("お気に入り操作時にエラーが発生しました。"));
			console.log(e);
		} finally {
			// dispatch(setLoading(false));
		}
	};
	return { deleteFavoriteAsync };
};
