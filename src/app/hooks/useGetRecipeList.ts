import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { RecipeListItem } from "../../Types";
import { useAppDispatch } from "./hooks";
import { setError, setLoading } from "../../features/loadingSlice";

export const useGetRecipeList = () => {
	const dispatch = useAppDispatch();

	const getRecipeList = async () => {
		dispatch(setLoading(true));
		try {
			const q = query(collection(db, "recipes"), orderBy("updatedAt", "desc"));

			const querySnapshot = await getDocs(q);
			const recipes: RecipeListItem[] = querySnapshot.docs.map((doc) => ({
				recipeName: doc.data().recipeName,
				recipeImageUrl: doc.data().recipeImageUrl,
				recipeId: doc.id,
				favoriteCount: doc.data().favoriteCount,
				isPublic: doc.data().isPublic,
				user: doc.data().user,
			}));

			return recipes;
		} catch (e: any) {
			dispatch(setError("レシピ取得時にエラーが発生しました。"));
			console.log(e);
			return [];
		} finally {
			dispatch(setLoading(false));
		}
	};
	return { getRecipeList };
};
