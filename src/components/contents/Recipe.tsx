import "./Recipe.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FavoriteState } from "../../Types";
import {
	useAppSelector,
	useAddFavorite,
	useDeleteFavorite,
	useDeleteFirebaseDocument,
} from "../../app/hooks/hooks";

const Recipe = () => {
	const [animatingFavIcon, setAnimatingFavIcon] = useState<boolean>(false);

	const user = useAppSelector((state) => state.user.user);
	const currentRecipe = useAppSelector((state) => state.recipe);
	const favorites = useAppSelector((state) => state.favorites);

	const navigate = useNavigate();

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();
	const { deleteFirebaseDocument } = useDeleteFirebaseDocument();

	useEffect(() => {
		if (!currentRecipe.recipeId) {
			navigate("/");
		}

		// console.log(favorites);
		// console.log(currentRecipe);
	}, []);

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

	const containsFavorites = (favorites: FavoriteState[], recipeId: string) => {
		return favorites.some((favorite) => favorite.recipeId === recipeId);
	};

	const getRecipeImage = (recipeImageUrl: string | null) => {
		// console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "noimage.jpg";
	};

	const getGroupIcon = (value: number) => {
		const symbols = ["", "★", "☆", "●", "○", "◎"];
		return symbols[value] || "";
	};

	const handleToEditRecipe = () => {
		navigate("/editrecipe");
	};

	const handleDeleteRecipe = () => {
		if (window.confirm("削除しますか？")) {
			if (currentRecipe.recipeId) {
				deleteFirebaseDocument(
					currentRecipe.recipeId,
					currentRecipe.recipeImageUrl
				);
			}
		}
		navigate("/");
	};

	return (
		<div className="recipe">
			<div className="recipeContainer">
				<h2>{currentRecipe.recipeName}</h2>
				<div className="recipeHeader">
					<div className="recipeHeaderAuther">
						by: {currentRecipe.userDisprayName}
					</div>
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
									: alert("お気に入り機能を使用するにはログインしてください。")
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
					{currentRecipe.user === user?.uid && (
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
							currentRecipe.materials.map((material, index) => (
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
							))}
					</ul>
				</section>

				<section className="recipeProcedure">
					<h3>作り方</h3>
					<ol>
						{currentRecipe.procedures &&
							currentRecipe.procedures.map((procedure, index) => (
								<li key={index}>{procedure}</li>
							))}
					</ol>
				</section>
			</div>
		</div>
	);
};

export default Recipe;
