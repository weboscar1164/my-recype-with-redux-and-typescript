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
	useFetchAdminsAndIgnores,
} from "../../app/hooks/hooks";
import { FavoriteState, InitialRecipeState, RecipeListItem } from "../../Types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setRecipeInfo } from "../../features/recipeSlice";
import RecipeImage from "./RecipeImage";
import Pagination from "../Pagination";

const recipeList = ({ listMode }: { listMode: string }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const [animatingFavIcon, setAnimatingFavIcon] = useState<string | null>(null);
	const [ignoreIdList, setIgnoreIdList] = useState<string[]>([]);

	const initialPage = Number(searchParams.get("page")) || 1;
	const [currentPage, setCurrentPage] = useState(initialPage);
	const recipesPerPage = 10;

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);
	const searchWord = useAppSelector((state) => state.searchWord);

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();
	const { getRecipeList } = useGetRecipeList();
	const { fetchAdminsAndIgnores } = useFetchAdminsAndIgnores();

	// 初回レンダリング時にrecipeList取得
	useEffect(() => {
		const fetchLists = async () => {
			const recipes = await getRecipeList();
			if (recipes) {
				setRecipeList(recipes);
			}

			const ignores = await fetchAdminsAndIgnores("ignores");
			ignores && setIgnoreIdList(ignores);
		};
		fetchLists();
	}, []);

	// ページ番号を変更したときにクエリパラメータを変更
	useEffect(() => {
		const currentPageFromParams = Number(searchParams.get("page"));
		if (currentPageFromParams !== currentPage) {
			setSearchParams({
				page: String(currentPage),
			});
		}
	}, [currentPage, setSearchParams, searchParams]);

	// recipeクリック時詳細ページにジャンプ
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
				userDisprayName: currentRecipe.userDisprayName,
				favoriteCount: currentRecipe.favoriteCount,
			};

			console.log("newRecipe: ", newRecipe);
			// console.log(newRecipe);
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

	// 表示するリストのソート
	const sortedRecipes = recipeList.filter((recipe) => {
		// 検索語句との一致
		const matchesSerch = searchWord
			? recipe.recipeName.toLowerCase().includes(searchWord.toLowerCase())
			: true;
		//　お気に入りモード時におけるお気に入りリストとの一致
		const matchesFavorites =
			listMode === "favorites"
				? favorites.some(
						(favorites: FavoriteState) => favorites.recipeId === recipe.recipeId
				  )
				: true;

		// マイレシピモード時におけるユーザーとの一致
		const matchesCurrentUser =
			listMode === "myRecipe" ? recipe.user === user.uid : true;

		// 公開状態のチェック
		const isPublicCheck = user
			? recipe.isPublic == 1 || recipe.user === user.uid
			: recipe.isPublic == 1;

		// user状態のチェック
		const isNotIgnores =
			ignoreIdList.length !== 0
				? ignoreIdList.some((ignoreId) => ignoreId !== recipe.user)
				: true;

		return (
			matchesSerch &&
			matchesFavorites &&
			isPublicCheck &&
			isNotIgnores &&
			matchesCurrentUser
		);
	});

	const totalPages = Math.ceil(sortedRecipes.length / recipesPerPage);

	const handleRenderTitle = (listMode: string) => {
		switch (listMode) {
			case "favorites":
				return "お気に入り一覧";
			case "myRecipe":
				return "マイレシピ";
			default:
				return "レシピ一覧";
		}
	};

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
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>{handleRenderTitle(listMode)}</h2>
				<h3>{searchWord && `検索結果: ${searchWord}`}</h3>
				{currentRecipes.length !== 0 ? (
					<>
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
												(favorite: FavoriteState) =>
													favorite.recipeId === item.recipeId
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
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</>
				) : (
					<p>レシピがありません。</p>
				)}
			</div>
		</div>
	);
};

export default recipeList;
