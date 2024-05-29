import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import { useAppDispatch } from "./hooks";
import {
	removeFavorite,
	setFavorites,
	addFavorite,
} from "../features/favoritesSlice";
import { FavoriteState } from "../Types";

export const useFavorites = () => {
	const [favoritesState, setFavoritesState] = useState<FavoriteState[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const dispatch = useAppDispatch();

	const fetchFavorites = async (userId: string) => {
		setLoading(true);
		try {
			const fetchedFavorites: FavoriteState[] = [];
			const favoritesRef = collection(db, "users", userId, "favorites");
			const snapshot = await getDocs(favoritesRef);
			snapshot.forEach((doc) => {
				const data = doc.data();

				const favorite: FavoriteState = {
					recipeId: data.recipeId,
					recipeName: data.recipeName,
					createdAt: data.createdAt.toDate().toISOString(),
				};
				fetchedFavorites.push(favorite);
			});
			// console.log(favorites);
			setFavoritesState(fetchedFavorites);
			dispatch(setFavorites(fetchedFavorites));
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return { fetchFavorites, loading, error };
};

export const useAddFavorite = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const dispatch = useAppDispatch();

	const addFavoriteAsync = async (
		userId: string,
		recipeId: string,
		recipeName: string
	) => {
		setLoading(true);
		try {
			const favoritesRef = collection(db, "users", userId, "favorites");
			const timeStamp = serverTimestamp();
			const docRef = await addDoc(favoritesRef, {
				recipeId,
				recipeName,
				createdAt: timeStamp,
			});

			const docSnapshot = await getDoc(docRef);
			const createdAt = docSnapshot.data()?.createdAt.toDate().toISOString();

			dispatch(
				addFavorite({
					// id:
					recipeId,
					recipeName,
					createdAt,
				})
			);
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return { addFavoriteAsync, loading, error };
};

export const useDeleteFavorite = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const dispatch = useAppDispatch();

	const deleteFavoriteAsync = async (userId: string, recipeId: string) => {
		setLoading(true);
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
			});
		} catch (e: any) {
			setError(e);
		} finally {
			setLoading(false);
		}
	};
	return { deleteFavoriteAsync, loading, error };
};
