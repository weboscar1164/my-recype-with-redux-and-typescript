import { doc, increment, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { addFavorite } from "../../features/favoritesSlice";
import { setFavoriteCount } from "../../features/recipeSlice";
import { setError } from "../../features/pageStatusSlice";

export const useAddFavorite = () => {
	const dispatch = useAppDispatch();

	const addFavoriteAsync = async (
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

				// お気に入りドキュメントの書き込み
				transaction.set(favoriteRef, {
					recipeId,
					userId,
					createdAt: Timestamp.now(),
				});

				// レシピのお気に入りカウントをインクリメント
				transaction.update(recipeMetaRef, { count: increment(1) });

				return currentCount + 1;
			});

			// // 追加したfavoriteをreduxに渡す
			dispatch(addFavorite({ recipeId }));
			dispatch(setFavoriteCount(newFavoriteCount));

			return newFavoriteCount;
		} catch (e: any) {
			dispatch(setError("お気に入り操作時にエラーが発生しました。"));
			console.error("Transaction failed: ", e);
			return null;
		}
	};

	return { addFavoriteAsync };
};
