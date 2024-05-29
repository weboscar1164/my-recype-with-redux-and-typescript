import React, { useEffect, useState } from "react";
import "./RecipeList.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FavoriteState, InitialRecipeState } from "../../Types";
import { useNavigate } from "react-router-dom";
import { setRecipeInfo } from "../../features/recipeSlice";
import userSlice from "../../features/userSlice";
import { useAddFavorite, useDeleteFavorite } from "../../app/firebaseHooks";

const recipeList = () => {
	interface RecipeListItem {
		recipeName: string;
		recipeImageUrl: string;
		recipeId: string;
	}

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);

	const {
		addFavoriteAsync,
		loading: loadingAdd,
		error: errorAdd,
	} = useAddFavorite();
	const {
		deleteFavoriteAsync,
		loading: loadingDelete,
		error: errorDelete,
	} = useDeleteFavorite();

	const handleToggleFavorite = async (
		userId: string,
		recipeId: string,
		recipeName: string
	) => {
		if (recipeId && containsFavoritesWithRecipeId(favorites, recipeId)) {
			deleteFavoriteAsync(userId, recipeId);
		} else {
			addFavoriteAsync(userId, recipeId, recipeName);
		}
	};
	useEffect(() => {
		getRecipeList();
	}, []);

	const getRecipeList = async () => {
		setRecipeList([]);

		const q = query(collection(db, "recipes"));

		const querySnapshot = await getDocs(q);
		const recipes: RecipeListItem[] = [];
		querySnapshot.forEach((doc) => {
			// console.log(doc.id, " => ", doc.data());
			recipes.push({
				recipeName: doc.data().recipeName,
				recipeImageUrl: doc.data().recipeImageUrl,
				recipeId: doc.id,
			});
		});
		setRecipeList(recipes);
	};

	const getRecipeImage = (recipeImageUrl: string) => {
		// console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "noimage.jpg";
	};

	const handleClickRecipe = async (recipeId: string) => {
		const docRef = doc(db, "recipes", recipeId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("DocumentData: ", docSnap.data());
			const currentRecipe = docSnap.data();
			const newRecipe: InitialRecipeState = {
				isPublic: currentRecipe.isPublic,
				recipeName: currentRecipe.recipeName,
				recipeImageUrl: currentRecipe.recipeImageUrl,
				comment: currentRecipe.comment,
				serves: currentRecipe.serves,
				materials: currentRecipe.materials,
				procedures: currentRecipe.procedures,
				recipeId: recipeId,
				user: currentRecipe.user,
				userDisprayName: currentRecipe.userDisprayName,
			};

			// console.log(newRecipe);
			dispatch(setRecipeInfo(newRecipe));
			navigate("/recipe");
		} else {
			console.log("no sutch document!");
		}
	};

	// favorites
	const containsFavoritesWithRecipeId = (
		favorites: FavoriteState[],
		recipeId: string
	) => {
		return favorites.some((favorite) => favorite.recipeId === recipeId);
	};

	return (
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>レシピ一覧</h2>
				<ul>
					{recipeList &&
						recipeList.map((item) => (
							<li key={item.recipeId}>
								<div
									className="recipeListItemLeft"
									onClick={() => handleClickRecipe(item.recipeId)}
								>
									<div className="recipeListImg">
										<img src={getRecipeImage(item.recipeImageUrl)} alt="" />
									</div>
									<h3>{item.recipeName}</h3>
								</div>
								<div
									className="recipeListFav"
									onClick={() =>
										user &&
										handleToggleFavorite(
											user.uid,
											item.recipeId,
											item.recipeName
										)
									}
								>
									{item.recipeId &&
									containsFavoritesWithRecipeId(favorites, item.recipeId) ? (
										<FavoriteIcon className="recipeHeaderFavIcon" />
									) : (
										<FavoriteBorderIcon className="recipeHeaderFavIcon" />
									)}
									<span>10</span>
								</div>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default recipeList;
