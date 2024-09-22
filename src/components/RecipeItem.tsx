import { useEffect, useState } from "react";
import { FavoriteState, InitialRecipeState, RecipeListItem } from "../Types";
import RecipeImage from "./contents/RecipeImage";
import { setRecipeInfo } from "../features/recipeSlice";
import { useNavigate } from "react-router-dom";
import {
	useAddFavorite,
	useAppDispatch,
	useAppSelector,
	useDeleteFavorite,
} from "../app/hooks/hooks";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const RecipeItem = ({
	currentRecipes,
	currentPage,
}: {
	currentRecipes: RecipeListItem[];
	currentPage: number;
}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [recipeList, setRecipeList] = useState(currentRecipes);
	const [animatingFavIcon, setAnimatingFavIcon] = useState<string | null>(null);

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();

	useEffect(() => {
		setRecipeList(currentRecipes);
	}, [currentRecipes]);

	// レシピクリック時の挙動
	const handleClickRecipe = async (recipeId: string) => {
		const docRef = doc(db, "recipes", recipeId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
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
				userDisplayName: currentRecipe.userDisplayName,
				favoriteCount: currentRecipe.favoriteCount,
			};

			console.log("newRecipe: ", newRecipe);
			dispatch(setRecipeInfo(newRecipe));
			navigate(`/recipe?currentPage=${currentPage}`);
		} else {
			console.log("no sutch document!");
		}
	};

	// お気に入り切り替え
	const handleClickFavorite = async (
		userId: string | undefined,
		recipeId: string,
		recipeName: string
	) => {
		if (userId) {
			const isFavorite = favorites.some(
				(favorite: FavoriteState) => favorite.recipeId === recipeId
			);
			if (recipeId && isFavorite) {
				await deleteFavoriteAsync(userId, recipeId);
				updateFavoriteCount(recipeId, -1);
			} else {
				await addFavoriteAsync(userId, recipeId, recipeName);
				updateFavoriteCount(recipeId, 1);
			}
			setAnimatingFavIcon(recipeId);

			setTimeout(() => setAnimatingFavIcon(null), 300);
		} else {
			alert("お気に入り機能を使用するにはログインしてください。");
		}
	};

	// お気に入りカウンターの操作
	const updateFavoriteCount = (recipeId: string, increment: number) => {
		setRecipeList((prevList) =>
			prevList.map((recipe) =>
				recipe.recipeId === recipeId
					? { ...recipe, favoriteCount: recipe.favoriteCount + increment }
					: recipe
			)
		);
	};

	return (
		<ul>
			{recipeList.map((item: RecipeListItem) => (
				<li key={item.recipeId}>
					<div
						className="recipeListItemLeft"
						onClick={() => handleClickRecipe(item.recipeId)}
					>
						<div className="recipeListImg">
							<RecipeImage
								src={item.recipeImageUrl ? item.recipeImageUrl : "noimage.jpg"}
								alt={item.recipeName}
							/>
						</div>
						<h3>{item.recipeName}</h3>
					</div>
					{item.isPublic == 1 ? (
						<div
							className="recipeListFav"
							onClick={() =>
								handleClickFavorite(user?.uid, item.recipeId, item.recipeName)
							}
						>
							{item.recipeId &&
							favorites.some(
								(favorite: FavoriteState) => favorite.recipeId === item.recipeId
							) ? (
								<FavoriteIcon
									className={`recipeHeaderFavIcon ${
										animatingFavIcon === item.recipeId &&
										"recipeHeaderFavIconAnimation"
									}`}
								/>
							) : (
								<FavoriteBorderIcon
									className={`recipeHeaderFavIcon ${
										animatingFavIcon === item.recipeId &&
										"recipeHeaderFavIconAnimation"
									}`}
								/>
							)}
							<span className="recipeHeaderFavCount">{item.favoriteCount}</span>
						</div>
					) : (
						<div className="recipeHeaderPrivate">非公開</div>
					)}
				</li>
			))}
		</ul>
	);
};

export default RecipeItem;
