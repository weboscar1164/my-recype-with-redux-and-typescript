import { doc, increment, runTransaction } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { removeFavorite } from "../../features/favoritesSlice";
import { setFavoriteCount } from "../../features/recipeSlice";
import { setError } from "../../features/pageStatusSlice";

export const useDeleteFavorite = () => {
	const dispatch = useAppDispatch();

	const deleteFavoriteAsync = async (
		userId: string,
		recipeId: string
	): Promise<number | null> => {
		try {
			//firebaseトランザクションで処理
			const favoriteRef = doc(db, "favorites", `${recipeId}_${userId}`);
			const recipeMetaRef = doc(
				db,
				"recipes",
				recipeId,
				"metaData",
				"favoriteCount"
			);

			const newFavoriteCount = await runTransaction(db, async (transaction) => {
				// レシピ情報を取得
				const recipeSnapshot = await transaction.get(recipeMetaRef);
				if (!recipeSnapshot.exists()) {
					throw new Error("レシピのメタデータが存在しません。");
				}

				// 現在のカウントを取得
				const currentCount = recipeSnapshot.data().count || 0;
				if (currentCount <= 0) {
					throw new Error("お気に入りカウントが不正です。");
				}

				// お気に入りドキュメントから削除
				transaction.delete(favoriteRef);

				// レシピのお気に入りカウントをデクリメント
				transaction.update(recipeMetaRef, { count: increment(-1) });

				return currentCount - 1;
			});

			// // 追加したfavoriteをreduxに渡す
			dispatch(removeFavorite(recipeId));
			dispatch(setFavoriteCount(newFavoriteCount));
			return newFavoriteCount;
		} catch (e: any) {
			dispatch(setError("お気に入り削除時にエラーが発生しました。"));
			console.log(e);
			return null;
		}
	};
	return { deleteFavoriteAsync };
};
