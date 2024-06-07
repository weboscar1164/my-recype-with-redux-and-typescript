import { useEffect, useState } from "react";
import "./RecipeList.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
	useAppDispatch,
	useAppSelector,
	useGetRecipeList,
	useAddFavorite,
	useDeleteFavorite,
} from "../../app/hooks/hooks";
import { InitialRecipeState, RecipeListItem } from "../../Types";
import { useNavigate } from "react-router-dom";
import { setRecipeInfo } from "../../features/recipeSlice";
import RecipeImage from "./RecipeImage";

const recipeList = ({ showFavorites }: { showFavorites: boolean }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const [animatingFavIcon, setAnimatingFavIcon] = useState<string | null>(null);

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);
	const searchWord = useAppSelector((state) => state.searchWord);

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();
	const { getRecipeList } = useGetRecipeList();

	// 初回レンダリング時にrecipeList取得
	useEffect(() => {
		const fetchRecipeList = async () => {
			const recipes = await getRecipeList();
			if (recipes) {
				setRecipeList(recipes);
			}
		};
		fetchRecipeList();
	}, []);

	// recipeクリック時詳細ページにジャンプ
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
				favoriteCount: currentRecipe.favoriteCount,
			};

			console.log("newRecipe: ", newRecipe);
			// console.log(newRecipe);
			dispatch(setRecipeInfo(newRecipe));
			navigate("/recipe");
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
				(favorite) => favorite.recipeId === recipeId
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

	const updateFavoriteCount = (recipeId: string, increment: number) => {
		setRecipeList((prevList) =>
			prevList.map((recipe) =>
				recipe.recipeId === recipeId
					? { ...recipe, favoriteCount: recipe.favoriteCount + increment }
					: recipe
			)
		);
	};

	// // お気に入り一覧表示
	// const sortedRecipes = showFavorites
	// 	? recipeList.filter((recipe) =>
	// 			favorites.some((favorite) => favorite.recipeId === recipe.recipeId)
	// 	  )
	// 	: recipeList;

	const sortedRecipes = recipeList.filter((recipe) => {
		const matchesSerch = searchWord
			? recipe.recipeName.toLowerCase().includes(searchWord.toLowerCase())
			: true;
		const matchesFavorites = showFavorites
			? favorites.some((favorites) => favorites.recipeId === recipe.recipeId)
			: true;
		return matchesSerch && matchesFavorites;
	});

	return (
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>{showFavorites ? "お気に入り一覧" : "レシピ一覧"}</h2>
				<h3>{searchWord && `検索結果: ${searchWord}`}</h3>
				<ul>
					{sortedRecipes.map((item: RecipeListItem) => (
						<li key={item.recipeId}>
							<div
								className="recipeListItemLeft"
								onClick={() => handleClickRecipe(item.recipeId)}
							>
								<div className="recipeListImg">
									<RecipeImage
										src={
											item.recipeImageUrl ? item.recipeImageUrl : "noimage.jpg"
										}
										alt={item.recipeName}
									/>
								</div>
								<h3>{item.recipeName}</h3>
							</div>
							<div
								className="recipeListFav"
								onClick={() =>
									handleClickFavorite(user?.uid, item.recipeId, item.recipeName)
								}
							>
								{item.recipeId &&
								favorites.some(
									(favorite) => favorite.recipeId === item.recipeId
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
								<span className="recipeHeaderFavCount">
									{item.favoriteCount}
								</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default recipeList;
