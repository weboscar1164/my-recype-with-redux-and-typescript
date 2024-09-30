import { useEffect, useState } from "react";
import "../RecipeList.scss";
import "./RecipeManagement.scss";
import {
	useAppSelector,
	useGetRecipeList,
	usePagination,
} from "../../../app/hooks/hooks";
import { RecipeListItem } from "../../../Types";
import Pagination from "../../Pagination";
import RecipeItem from "../../RecipeItem";

const RecipeManagement = () => {
	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	const recipesPerPage = 10;

	const user = useAppSelector((state) => state.user.user);
	const searchWord = useAppSelector((state) => state.searchWord);

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

	//paginationフックを用いてページネーション用変数を準備
	const {
		currentItems: currentRecipes,
		totalPages,
		currentPage,
		handlePageChange,
	} = usePagination(sortedRecipes, recipesPerPage);

	return (
		<div className="recipeList recipeListAdmin">
			<div className="recipeListContainer">
				<h2>レシピ管理画面</h2>
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

export default RecipeManagement;
