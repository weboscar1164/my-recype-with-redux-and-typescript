import "./Recipe.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FavoriteState, MaterialState } from "../../Types";
import {
	useAppSelector,
	useAddFavorite,
	useDeleteFavorite,
	useDeleteFirebaseDocument,
} from "../../app/hooks/hooks";

const Recipe = () => {
	const [animatingFavIcon, setAnimatingFavIcon] = useState<boolean>(false);

	// URLから所在ページを取得
	const [searchParams] = useSearchParams();

	const [currentPage, setCurrentPage] = useState<string>("");

	const user = useAppSelector((state) => state.user.user);
	const currentRecipe = useAppSelector((state) => state.recipe);
	const favorites = useAppSelector((state) => state.favorites);
	const isAdminMode = useAppSelector((state) => state.pageStatus.isAdminMode);

	const navigate = useNavigate();

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();
	const { deleteFirebaseDocument } = useDeleteFirebaseDocument();

	useEffect(() => {
		console.log("searchParams:", searchParams);
		// レシピデータが入っていない場合は一覧にリダイレクトする
		if (!currentRecipe.recipeId) {
			navigate("/");
		}
		// URLからページ番号を取得
		setCurrentPage(searchParams.get("page") || "");
	}, []);

	// お気に入り制御
	const handleChangeFavorite = async (
		userId: string,
		recipeId: string,
		recipeName: string
	) => {
		if (containsFavorites(favorites, recipeId)) {
			await deleteFavoriteAsync(userId, recipeId);
		} else {
			await addFavoriteAsync(userId, recipeId, recipeName);
		}
		setAnimatingFavIcon(true);
		setTimeout(() => setAnimatingFavIcon(false), 300);
	};

	// お気に入りの状態を取得
	const containsFavorites = (favorites: FavoriteState[], recipeId: string) => {
		return favorites.some((favorite) => favorite.recipeId === recipeId);
	};

	// レシピ画像がない場合はnoimageを表示
	const getRecipeImage = (recipeImageUrl: string | null) => {
		// console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "noimage.jpg";
	};

	// グループ記号を取得
	const getGroupIcon = (value: number) => {
		const symbols = ["", "★", "☆", "●", "○", "◎"];
		return symbols[value] || "";
	};

	// 編集画面にジャンプ
	const handleToEditRecipe = () => {
		navigate("/editrecipe");
	};

	// 前のページに戻る
	const handleBack = () => {
		if (currentPage) {
			// currentPage をクエリパラメータに追加して指定ページに戻る
			navigate(`/?page=${currentPage}`);
		} else {
			// currentPage が無い場合は通常の前ページに戻る動作
			navigate(-1);
		}
	};

	// レシピ削除
	const handleDeleteRecipe = async () => {
		if (window.confirm("削除しますか？")) {
			if (currentRecipe.recipeId) {
				try {
					await deleteFirebaseDocument(
						currentRecipe.recipeId,
						currentRecipe.recipeImageUrl
					);
					if (isAdminMode) {
						navigate("/admin");
					} else {
						navigate("/");
					}
				} catch (error) {
					console.error("レシピ削除時にエラーが発生しました: ", error);
				}
			}
		}
	};

	return (
		<div className="recipe">
			<div className="recipeContainer">
				<div className="recipeTitle">
					<h2>{currentRecipe.recipeName}</h2>
					{isAdminMode && <div className="recipeTitleAdmin">管理者モード</div>}
				</div>
				<div className="recipeHeader">
					<div className="recipeHeaderAuther">
						by: {currentRecipe.userDisprayName}
					</div>
					{currentRecipe.isPublic == 1 ? (
						<Tooltip title="お気に入り">
							<div
								className="recipeHeaderFav"
								onClick={() =>
									user?.uid
										? currentRecipe.recipeId &&
										  currentRecipe.recipeName &&
										  handleChangeFavorite(
												user.uid,
												currentRecipe.recipeId,
												currentRecipe.recipeName
										  )
										: alert(
												"お気に入り機能を使用するにはログインしてください。"
										  )
								}
							>
								{currentRecipe.recipeId &&
								containsFavorites(favorites, currentRecipe.recipeId) ? (
									<FavoriteIcon
										className={`recipeHeaderFavIcon ${
											animatingFavIcon && "recipeHeaderFavIconAnimation"
										}`}
									/>
								) : (
									<FavoriteBorderIcon
										className={`recipeHeaderFavIcon ${
											animatingFavIcon && "recipeHeaderFavIconAnimation"
										}`}
									/>
								)}

								<span className="recipeHeaderFavCount">
									{currentRecipe.favoriteCount}
								</span>
							</div>
						</Tooltip>
					) : (
						<Tooltip title="公開していません">
							<div className="recipeHeaderPrivate">非公開</div>
						</Tooltip>
					)}
					{(currentRecipe.user === user?.uid || isAdminMode) && (
						<>
							<Tooltip title="編集">
								<div className="recipeHeaderEdit" onClick={handleToEditRecipe}>
									<EditIcon />
								</div>
							</Tooltip>
							<Tooltip title="削除">
								<div
									className="recipeHeaderDelete"
									onClick={handleDeleteRecipe}
								>
									<DeleteIcon />
								</div>
							</Tooltip>
						</>
					)}
				</div>
				{/* <div className="recipeTag">
					<ul>
						<li>ハンバーグ</li>
						<li>オーブン</li>
						<li>ひき肉</li>
					</ul>
				</div> */}
				<p className="recipeImg">
					<img src={getRecipeImage(currentRecipe.recipeImageUrl)} alt="" />
				</p>
				<section className="recipeInfo">
					<h3>Comment</h3>
					<p>{currentRecipe.comment}</p>
				</section>

				<section className="recipeMaterial">
					<h3>材料{currentRecipe.serves}人分</h3>
					<ul>
						{currentRecipe.materials &&
							currentRecipe.materials.map(
								(material: MaterialState, index: number) => (
									<li key={`material-${index}`}>
										<div className="recipeMaterialGroup">
											{getGroupIcon(material.group)}
										</div>
										<div className="recipeMaterialContents">
											<div className="recipeMaterialName">{material.name}</div>
											<div className="recipeMaterialQuantity">
												{material.quantity}
											</div>
										</div>
									</li>
								)
							)}
					</ul>
				</section>

				<section className="recipeProcedure">
					<h3>作り方</h3>
					<ol>
						{currentRecipe.procedures &&
							currentRecipe.procedures.map(
								(procedure: string, index: number) => (
									<li key={index}>{procedure}</li>
								)
							)}
					</ol>
				</section>
				<div className="recipeSubmit">
					<button onClick={handleBack}>前のページに戻る</button>
				</div>
			</div>
		</div>
	);
};

export default Recipe;
