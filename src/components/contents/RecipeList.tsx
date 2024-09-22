import { useEffect, useState } from "react";
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

const recipeList = ({ listMode }: { listMode: string }) => {
	const dispatch = useAppDispatch();

	const [searchParams, setSearchParams] = useSearchParams();

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const [ignoreIdList, setIgnoreIdList] = useState<string[]>([]);

	const recipesPerPage = 10;

	const favorites = useAppSelector((state) => state.favorites);
	const user = useAppSelector((state) => state.user.user);
	const searchWord = useAppSelector((state) => state.searchWord);

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
			dispatch(setAdmin(false));
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
	}, [setSearchParams, searchParams]);

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
			listMode === "myRecipe" && user ? recipe.user === user.uid : true;

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

	//paginationフックを用いてページネーション用変数を準備
	const {
		currentItems: currentRecipes,
		totalPages,
		currentPage,
		handlePageChange,
	} = usePagination(sortedRecipes, recipesPerPage);

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
	return (
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>{handleRenderTitle(listMode)}</h2>
				<h3>{searchWord && `検索結果: ${searchWord}`}</h3>
				{currentRecipes.length !== 0 ? (
					<>
						<RecipeItem
							currentRecipes={currentRecipes}
							currentPage={currentPage}
						/>
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
