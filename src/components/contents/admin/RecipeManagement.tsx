import { useEffect, useState } from "react";
import "../RecipeList.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import {
	useAppDispatch,
	useAppSelector,
	useGetRecipeList,
	useAddFavorite,
	useDeleteFavorite,
} from "../../../app/hooks/hooks";
import { InitialRecipeState, RecipeListItem } from "../../../Types";
import { useNavigate } from "react-router-dom";
import { setRecipeInfo } from "../../../features/recipeSlice";
import RecipeImage from "../RecipeImage";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const RecipeManagement = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const [animatingFavIcon, setAnimatingFavIcon] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const recipesPerPage = 10;

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

	// 表示するリストのソート
	const sortedRecipes = recipeList.filter((recipe) => {
		// 検索語句との一致
		const matchesSerch = searchWord
			? recipe.recipeName.toLowerCase().includes(searchWord.toLowerCase())
			: true;

		// 公開状態のチェック
		const isPublicCheck = user
			? recipe.isPublic == 1 || recipe.user === user.uid
			: recipe.isPublic == 1;
		return matchesSerch && isPublicCheck;
	});

	//ページネーションのためのインデックス計算
	const indexOfLastRecipe = currentPage * recipesPerPage;
	const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
	const currentRecipes = sortedRecipes.slice(
		indexOfFirstRecipe,
		indexOfLastRecipe
	);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handleNextPage = () => {
		if (currentPage < pageNumbers.length) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const pageNumbers: number[] = [];
	for (let i = 1; i <= Math.ceil(sortedRecipes.length / recipesPerPage); i++) {
		pageNumbers.push(i);
	}

	const maxPageNumbersToshow = 5;
	const totalPageNumbers = pageNumbers.length;

	const renderPageNumbers = () => {
		if (totalPageNumbers <= maxPageNumbersToshow) {
			return pageNumbers.map((number) => (
				<button
					key={number}
					onClick={() => handlePageChange(number)}
					className={`paginationButton ${
						number === currentPage ? "paginationActive" : "paginationInactive"
					}`}
				>
					{number}
				</button>
			));
		}

		const pages = [];
		let startPage, endPage;

		if (currentPage <= 3) {
			startPage = 1;
			endPage = maxPageNumbersToshow;
		} else if (currentPage + 2 >= totalPageNumbers) {
			startPage = totalPageNumbers - 4;
			endPage = totalPageNumbers;
		} else {
			startPage = currentPage - 2;
			endPage = currentPage + 2;
		}

		// Add first page and ellipsis if needed
		if (startPage > 1) {
			pages.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className="paginationButton paginationInactive"
				>
					1
				</button>
			);
			if (startPage > 2) {
				pages.push(<span key="start-ellipsis">...</span>);
			}
		}

		// Add page numbers
		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`paginationButton ${
						i === currentPage ? "paginationActive" : "paginationInactive"
					}`}
				>
					{i}
				</button>
			);
		}

		// Add last page and ellipsis if needed
		if (endPage < totalPageNumbers) {
			if (endPage < totalPageNumbers - 1) {
				pages.push(<span key="end-ellipsis">...</span>);
			}
			pages.push(
				<button
					key={totalPageNumbers}
					onClick={() => handlePageChange(totalPageNumbers)}
					className="paginationButton paginationInactive"
				>
					{totalPageNumbers}
				</button>
			);
		}

		return pages;
	};

	return (
		<div className="recipeList recipeListAdmin">
			<div className="recipeListAdminContainer">
				<h2>レシピ管理画面</h2>
				<h3>{searchWord && `検索結果: ${searchWord}`}</h3>
				{currentRecipes.length !== 0 ? (
					<ul>
						{currentRecipes.map((item: RecipeListItem) => (
							<li key={item.recipeId}>
								<div
									className="recipeListItemLeft"
									onClick={() => handleClickRecipe(item.recipeId)}
								>
									<div className="recipeListImg">
										<RecipeImage
											src={
												item.recipeImageUrl
													? item.recipeImageUrl
													: "noimage.jpg"
											}
											alt={item.recipeName}
										/>
									</div>
									<h3>{item.recipeName}</h3>
								</div>
								{item.isPublic == 1 ? (
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
								) : (
									<div className="recipeHeaderPrivate">非公開</div>
								)}
							</li>
						))}
					</ul>
				) : (
					<p>レシピがありません。</p>
				)}
				<div className="pagination">
					<div
						className={`paginationChangepage ${
							currentPage !== 1 ? "paginationChangepageActive" : ""
						}`}
						onClick={handlePrevPage}
					>
						<ArrowBackIosNewIcon />
					</div>
					{renderPageNumbers()}

					<div
						className={`paginationChangepage ${
							currentPage !== pageNumbers.length
								? "paginationChangepageActive"
								: ""
						}`}
						onClick={handleNextPage}
					>
						<ArrowForwardIosIcon />
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecipeManagement;
