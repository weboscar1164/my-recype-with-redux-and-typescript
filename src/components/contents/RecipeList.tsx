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

const recipeList = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const [animatingFavIcon, setAnimatingFavIcon] = useState<string | null>(null);

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);

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

	// const getRecipeList = async () => {
	// 	try {
	// 		const q = query(collection(db, "recipes"));

	// 		const querySnapshot = await getDocs(q);
	// 		const recipes: RecipeListItem[] = querySnapshot.docs.map((doc) => ({
	// 			recipeName: doc.data().recipeName,
	// 			recipeImageUrl: doc.data().recipeImageUrl,
	// 			recipeId: doc.id,
	// 			favoriteCount: doc.data().favoriteCount,
	// 		}));
	// 		return recipes;
	// 	} catch (e) {
	// 		console.log(e);
	// 		return [];
	// 	}
	// };

	const getRecipeImage = (recipeImageUrl: string) => {
		// console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "noimage.jpg";
	};

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

	// favorites

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

	return (
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>レシピ一覧</h2>
				<ul>
					{recipeList &&
						recipeList.map((item: RecipeListItem) => (
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
										handleClickFavorite(
											user?.uid,
											item.recipeId,
											item.recipeName
										)
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
