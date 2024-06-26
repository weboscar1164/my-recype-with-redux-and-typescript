import {
	CollectionReference,
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useAppDispatch, useAppSelector } from "./hooks";
import { InitialRecipeState } from "../../Types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { resetRecipeInfo } from "../../features/recipeSlice";
import { setError, setLoading } from "../../features/loadingSlice";
import { useNavigate } from "react-router-dom";

export const useUploadRecipe = () => {
	const navigate = useNavigate();

	const user = useAppSelector((state) => state.user.user);
	const recipeInfo = useAppSelector((state) => state.recipe);

	const dispatch = useAppDispatch();

	const uploadRecipeToFirestore = async () => {
		dispatch(setLoading(true));

		try {
			let imageUrl = await handleImageUpload(recipeInfo.recipeImageUrl);
			await saveRecipeToFirestore(imageUrl);

			navigate("/");
			dispatch(resetRecipeInfo());
		} catch (error) {
			dispatch(setError("レシピのアップロード時にエラーが発生しました。"));
			throw error;
		} finally {
			dispatch(setLoading(false));
		}
	};

	const handleImageUpload = async (imageUrl: string | null) => {
		if (
			imageUrl &&
			!imageUrl.startsWith("https://firebasestorage.googleapis.com/")
		) {
			return await uploadImage(imageUrl);
		}
		return imageUrl || "";
	};

	const uploadImage = async (fileUrl: string) => {
		try {
			const response = await fetch(fileUrl);

			if (!response.ok) {
				throw new Error("Failed to fetch image blob");
			}
			const fileBlob = await response.blob();
			const timeStamp = new Date().getTime();
			const uniqueFilename = `${timeStamp}_recipe_image`;
			const storageRef = ref(storage, uniqueFilename);

			await uploadBytes(storageRef, fileBlob);

			const fireBaseStorageUrl = await getDownloadURL(storageRef);

			return fireBaseStorageUrl;
		} catch (e: any) {
			dispatch(setError("画像のアップロード時にエラーが発生しました。"));
			throw e;
		}
	};

	const saveRecipeToFirestore = async (imageUrl: string) => {
		if (!user) {
			dispatch(setError("ユーザーが認証されていません。"));
			return;
		}
		const recipeData = {
			isPublic: recipeInfo.isPublic,
			recipeName: recipeInfo.recipeName,
			comment: recipeInfo.comment,
			user: user.uid,
			userDisplayName: user.displayName,
			recipeImageUrl: imageUrl,
			serves: recipeInfo.serves,
			materials: recipeInfo.materials,
			procedures: recipeInfo.procedures,
			updatedAt: serverTimestamp(),
		};

		if (!recipeInfo.recipeId) {
			Object.assign(recipeData, {
				favoriteCount: 0,
				createdAt: serverTimestamp(),
			});
		}

		try {
			if (recipeInfo.recipeId) {
				const docRef = doc(db, "recipes", recipeInfo.recipeId);
				await updateDoc(docRef, recipeData);
			} else {
				const collectionRef = collection(
					db,
					"recipes"
				) as CollectionReference<InitialRecipeState>;
				await addDoc(collectionRef, recipeData);
			}
		} catch (error) {
			console.error(error);
			const errorMessage = recipeInfo.recipeId
				? "レシピ更新時にエラーが発生しました。"
				: "レシピ追加時にエラーが発生しました。";
			dispatch(setError(errorMessage));
			throw error;
		}
	};
	return { uploadRecipeToFirestore };
};
