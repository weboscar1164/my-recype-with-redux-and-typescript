import { useEffect, useState } from "react";
import { FavoriteState, RecipeListItem } from "../Types";
import RecipeImage from "./contents/RecipeImage";
import { useLocation, useNavigate } from "react-router-dom";
import {
	useAddFavorite,
	useAppDispatch,
	useAppSelector,
	useDeleteFavorite,
	useSignIn,
} from "../app/hooks/hooks";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { openModal, resetModal } from "../features/modalSlice";

const RecipeItem = ({
	currentRecipes,
	currentPage,
	updateRecipeList,
}: {
	currentRecipes: RecipeListItem[];
	currentPage: number;
	updateRecipeList: (recipeId: string, newFavoriteCount: number) => void;
}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const [recipeList, setRecipeList] = useState(currentRecipes);
	const [animatingFavIcon, setAnimatingFavIcon] = useState<string | null>(null);
	const [processingFavorites, setIsProcessingFavorites] = useState<
		string | null
	>(null);
	const [confirmAction, setConfirmAction] = useState<string | null>(null);

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);
	const modalState = useAppSelector((state) => state.modal);

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();
	const { signIn } = useSignIn();

	useEffect(() => {
		setRecipeList(currentRecipes);
	}, [currentRecipes]);

	useEffect(() => {
		// ログインモーダルの確認処理
		const handleLogin = async () => {
			if (modalState.confirmed !== null && confirmAction === "login") {
				if (modalState.confirmed) {
					signIn();
				}
			}
			dispatch(resetModal());
			setConfirmAction(null);
		};
		handleLogin();
	}, [modalState.confirmed]);

	// お気に入り切り替え
	const handleClickFavorite = async (
		userId: string | undefined,
		recipeId: string,
	) => {
		if (processingFavorites === recipeId) return;
		setIsProcessingFavorites(recipeId);

		try {
			if (userId) {
				// 現在のお気に入り状態を確認
				const isFavorite = favorites.some(
					(favorite: FavoriteState) => favorite.recipeId === recipeId,
				);

				// reduxとfirestoreの整合性を保ちながら処理
				var newCount;
				if (isFavorite) {
					newCount = await deleteFavoriteAsync(userId, recipeId);
				} else {
					newCount = await addFavoriteAsync(userId, recipeId);
				}
				if (newCount !== null) {
					updateFavoriteCount(recipeId, newCount);
				} else {
					throw new Error("お気に入りの更新に失敗しました");
				}

				// お気に入りアイコンのアニメーション設定
				setAnimatingFavIcon(recipeId);
				setTimeout(() => setAnimatingFavIcon(null), 300);
			} else {
				setConfirmAction("login");
				dispatch(
					openModal({
						message: "ログインが必要です。ログインしますか？",
					}),
				);
			}
		} finally {
			setIsProcessingFavorites(null);
		}
	};

	// お気に入りカウンターの操作
	const updateFavoriteCount = (recipeId: string, newCount: number) => {
		setRecipeList((prevList) =>
			prevList.map((recipe) =>
				recipe.recipeId === recipeId
					? { ...recipe, favoriteCount: newCount }
					: recipe,
			),
		);
		updateRecipeList(recipeId, newCount);
	};

	const handleNavigateToDetail = (recipeId: string) => {
		const targetPath = `${location.pathname}/${recipeId}?page=${currentPage}`;
		navigate(targetPath, {
			state: { from: location.pathname },
		});
	};

	return (
		<ul>
			{recipeList.map((item: RecipeListItem) => (
				<li key={item.recipeId}>
					<div
						className="recipeListItemLeft"
						onClick={() => handleNavigateToDetail(item.recipeId)}
					>
						<div className="recipeListImg">
							<RecipeImage
								src={item.recipeImageUrl ? item.recipeImageUrl : "/noimage.jpg"}
								alt={item.recipeName}
							/>
						</div>
						<h3>{item.recipeName}</h3>
					</div>
					{item.isPublic == 1 ? (
						<div
							className="recipeListFav"
							onClick={() => handleClickFavorite(user?.uid, item.recipeId)}
						>
							{item.recipeId &&
							favorites.some(
								(favorite: FavoriteState) =>
									favorite.recipeId === item.recipeId,
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
