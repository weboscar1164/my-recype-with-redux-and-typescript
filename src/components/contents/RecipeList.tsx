import { useEffect, useMemo, useState } from "react";
import "./RecipeList.scss";
import {
	useAppSelector,
	useGetRecipeList,
	useFetchAdminsAndIgnores,
	useAppDispatch,
} from "../../app/hooks/hooks";
import { FavoriteState, RecipeListItem } from "../../Types";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import RecipeItem from "../RecipeItem";
import { usePagination } from "../../app/hooks/hooks";
import { setAdmin } from "../../features/pageStatusSlice";
import Fuse from "fuse.js";

const RecipeList = ({
	listMode,
}: {
	listMode: "all" | "favorites" | "myRecipe" | "admin";
}) => {
	const dispatch = useAppDispatch();

	const [searchParams, setSearchParams] = useSearchParams();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const [ignoreIdList, setIgnoreIdList] = useState<string[]>([]);

	const recipesPerPage = 10;

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);
	const searchQuery = searchParams.get("search") ?? "";

	const { getRecipeList } = useGetRecipeList();
	const { fetchAdminsAndIgnores } = useFetchAdminsAndIgnores();

	const normalizeText = (text: string) =>
		toHiragana(text).toLowerCase().normalize("NFKC").trim();

	// 初回レンダリング時にrecipeList取得
	useEffect(() => {
		const fetchLists = async () => {
			const recipes = await getRecipeList();
			if (recipes) {
				setRecipeList(recipes);
			}

			const ignores = await fetchAdminsAndIgnores("ignores");
			ignores && setIgnoreIdList(ignores);
			dispatch(setAdmin(false));
		};
		fetchLists();
	}, []);

	const pageFromUrl = Number(searchParams.get("page")) || 1;

	// 表示するリストのソート
	const toHiragana = (str: string) =>
		str.replace(/[\u30a1-\u30f6]/g, (match) =>
			String.fromCharCode(match.charCodeAt(0) - 0x60),
		);

	const fuse = useMemo(() => {
		const indexData = recipeList.map((recipe) => ({
			...recipe,
			_searchName: normalizeText(recipe.recipeName),
			_searchTags: recipe.tags?.map((tag) => normalizeText(tag)) ?? [],
		}));

		return new Fuse(indexData, {
			keys: ["_searchName", "_searchTags"],
			threshold: 0.4,
			ignoreLocation: true,
		});
	}, [recipeList]);

	const searchedRecipes = useMemo(() => {
		if (!searchQuery) return recipeList;

		return fuse.search(normalizeText(searchQuery)).map((result) => result.item);
	}, [searchQuery, fuse]);

	const sortedRecipes = searchedRecipes.filter((recipe) => {
		//　お気に入りモード時におけるお気に入りリストとの一致
		const matchesFavorites =
			listMode === "favorites"
				? favorites.some(
						(favorites: FavoriteState) =>
							favorites.recipeId === recipe.recipeId,
					)
				: true;

		// マイレシピモード時におけるユーザーとの一致
		const matchesCurrentUser =
			listMode === "myRecipe" && user ? recipe.user === user.uid : true;

		// 公開状態のチェック
		let isPublicCheck = true;
		if (listMode !== "admin") {
			isPublicCheck = user
				? recipe.isPublic == 1 || recipe.user === user.uid
				: recipe.isPublic == 1;
		}

		// user状態のチェック
		const isNotIgnores = !ignoreIdList.includes(recipe.user);

		return (
			matchesFavorites && isPublicCheck && isNotIgnores && matchesCurrentUser
		);
	});

	// お気に入り操作時にrecipeListを更新
	const handleUpdateRecipeList = (
		recipeId: string,
		newFavoriteCount: number,
	) => {
		setRecipeList((prevState) =>
			prevState.map((recipe) =>
				recipe.recipeId === recipeId
					? { ...recipe, favoriteCount: newFavoriteCount }
					: recipe,
			),
		);
	};

	//paginationフックを用いてページネーション用変数を準備
	const {
		currentItems: currentRecipes,
		totalPages,
		currentPage,
		handlePageChange,
	} = usePagination(sortedRecipes, recipesPerPage, pageFromUrl);

	useEffect(() => {
		setSearchParams((prev) => {
			const params = new URLSearchParams(prev);
			params.set("page", String(currentPage));
			return params;
		});
	}, [currentPage]);

	const handleRenderTitle = (
		listMode: "all" | "favorites" | "myRecipe" | "admin",
	) => {
		switch (listMode) {
			case "favorites":
				return "お気に入り一覧";
			case "myRecipe":
				return "マイレシピ";
			case "admin":
				return "レシピ管理";
			default:
				return "レシピ一覧";
		}
	};

	return (
		<div
			className={`recipeList ${listMode === "admin" ? "recipeListAdmin" : ""}`}
		>
			<div
				className={`${listMode !== "admin" ? "container" : ""} recipeListContainer`}
			>
				<h2>{handleRenderTitle(listMode)}</h2>
				<h3>{searchQuery && `検索結果: ${searchQuery}`}</h3>
				{currentRecipes.length !== 0 ? (
					<>
						<RecipeItem
							currentRecipes={currentRecipes}
							currentPage={currentPage}
							updateRecipeList={handleUpdateRecipeList}
						/>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</>
				) : searchQuery ? (
					<p>「{searchQuery}」の検索結果はありません</p>
				) : (
					<p>レシピがありません。</p>
				)}
			</div>
		</div>
	);
};

export default RecipeList;
