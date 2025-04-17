import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { RecipeListItem } from "../../Types";
import { useAppDispatch } from "./hooks";
import { setError, setLoading } from "../../features/pageStatusSlice";

export const useGetRecipeList = () => {
	const dispatch = useAppDispatch();

	const getRecipeList = async () => {
		dispatch(setLoading(true));
		try {
			const q = query(collection(db, "recipes"), orderBy("updatedAt", "desc"));
			const querySnapshot = await getDocs(q);

			const recipes: RecipeListItem[] = await Promise.all(
				querySnapshot.docs.map(async (docSnapshot) => {
					// metaDataドキュメントを参照
					const metaDataDocRef = doc(
						db,
						"recipes",
						docSnapshot.id,
						"metaData",
						"favoriteCount"
					);
					// console.log("metaDataDocRef path: ", metaDataDocRef.path);

					const metaDataSnapshot = await getDoc(metaDataDocRef);
					// console.log("metaDataSnapshot.exists():", metaDataSnapshot.exists());

					// favoriteCountを取得（存在しない場合はデフォルト値 0）
					const favoriteCount = metaDataSnapshot.exists()
						? metaDataSnapshot.data().count || 0
						: 0;
					// console.log("favoriteCount: ", favoriteCount);

					return {
						recipeName: docSnapshot.data().recipeName,
						tags: docSnapshot.data().tags,
						recipeImageUrl: docSnapshot.data().recipeImageUrl,
						recipeId: docSnapshot.id,
						favoriteCount,
						isPublic: docSnapshot.data().isPublic,
						user: docSnapshot.data().user,
						userDisplayName: docSnapshot.data().userDisplayName,
					};
				})
			);
			return recipes;
		} catch (e: any) {
			dispatch(setError("レシピ取得時にエラーが発生しました。"));
			console.error(e);
			return [];
		} finally {
			dispatch(setLoading(false));
		}
	};
	return { getRecipeList };
};
