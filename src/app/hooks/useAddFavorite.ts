import {
	addDoc,
	collection,
	doc,
	getDoc,
	increment,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { addFavorite } from "../../features/favoritesSlice";
import { setFavoriteCount } from "../../features/recipeSlice";
import { setError, setLoading } from "../../features/loadingSlice";

export const useAddFavorite = () => {
	const dispatch = useAppDispatch();

	const addFavoriteAsync = async (
		userId: string,
		recipeId: string,
		recipeName: string
	) => {
		// dispatch(setLoading(true));
		try {
			// userのサブクエリfavoritesに追加
			const favoritesRef = collection(db, "users", userId, "favorites");
			const timeStamp = serverTimestamp();
			const docRef = await addDoc(favoritesRef, {
				recipeId,
				recipeName,
				createdAt: timeStamp,
			});

			// firebase内のtimestampをISOに変換
			const docSnapshot = await getDoc(docRef);
			const createdAt = docSnapshot.data()?.createdAt.toDate().toISOString();

			// 追加したfavoriteをreduxに渡す
			dispatch(
				addFavorite({
					recipeId,
					recipeName,
					createdAt,
				})
			);

			// recipeのfavoritCountをインクリメント
			const recipeRef = doc(db, "recipes", recipeId);
			await updateDoc(recipeRef, {
				favoriteCount: increment(1),
			});

			const recipeDocSnapshot: any = await getDoc(recipeRef);
			const favoriteCount = recipeDocSnapshot.data().favoriteCount;

			dispatch(setFavoriteCount(favoriteCount));
		} catch (e: any) {
			dispatch(setError("お気に入り操作時にエラーが発生しました。"));
			console.log(e);
		} finally {
			// dispatch(setLoading(false));
		}
	};

	return { addFavoriteAsync };
};
