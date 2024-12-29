import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { setFavorites } from "../../features/favoritesSlice";
import { FavoriteState } from "../../Types";
import { setError, setLoading } from "../../features/pageStatusSlice";

export const useFetchFavorites = () => {
	const dispatch = useAppDispatch();

	const fetchFavorites = async (userId: string) => {
		dispatch(setLoading(true));
		try {
			const fetchedFavorites: FavoriteState[] = [];
			// const favoritesRef = collection(db, "users", userId, "favorites");
			// const snapshot = await getDocs(favoritesRef);
			// snapshot.forEach((doc) => {
			// 	const data = doc.data();

			// 	const favorite: FavoriteState = {
			// 		recipeId: data.recipeId,
			// 		recipeName: data.recipeName,
			// 		createdAt: data.createdAt.toDate().toISOString(),
			// 	};
			// 	fetchedFavorites.push(favorite);
			// });
			// // console.log(favorites);
			// dispatch(setFavorites(fetchedFavorites));

			const q = query(
				collection(db, "favorites"),
				where("userId", "==", userId)
			);
			const querySnapshot = await getDocs(q);
			// const fetchedFavorites = querySnapshot.docs.map((doc) => doc.data());
			querySnapshot.docs.forEach((doc) => {
				const data = doc.data();

				const favorite: FavoriteState = {
					recipeId: data.recipeId,
					createdAt: data.createdAt.toDate().toISOString(),
				};
				fetchedFavorites.push(favorite);
			});
			// console.log(fetchedFavorites);
			dispatch(setFavorites(fetchedFavorites));
		} catch (e: any) {
			dispatch(setError("お気に入り取得時にエラーが発生しました。"));
			console.log(e);
		} finally {
			dispatch(setLoading(false));
		}
	};

	return { fetchFavorites };
};
