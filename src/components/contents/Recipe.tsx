import "./Recipe.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Tooltip } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {
	useAddFavorite,
	useDeleteFavorite,
	useFavorites,
} from "../../app/firebaseHooks";
import { FavoriteState } from "../../Types";

const Recipe = () => {
	const initialState = {
		isPublic: 0,
		recipeName: null,
		recipeImageUrl: null,
		comment: null,
		serves: 0,
		materials: null,
		procedures: null,
	};

	const user = useAppSelector((state) => state.user.user);
	const currentRecipe = useAppSelector((state) => state.recipe);
	const favorites = useAppSelector((state) => state.favorites);

	const navigate = useNavigate();

	const {
		addFavoriteAsync,
		loading: loadingAdd,
		error: errorAdd,
	} = useAddFavorite();
	const {
		deleteFavoriteAsync,
		loading: loadingDelete,
		error: errorDelete,
	} = useDeleteFavorite();

	// if (loadingFavorites) return <p>Loading favorites...</p>;
	// if (errorFavorites) return <p>Error loading favorites: {errorFavorites.message}</p>;

	const handleToggleFavorite = async (
		userId: string,
		recipeId: string,
		recipeName: string
	) => {
		if (
			currentRecipe.recipeId &&
			containsFavoritesWithRecipeId(favorites, currentRecipe.recipeId)
		) {
			deleteFavoriteAsync(userId, recipeId);
		} else {
			addFavoriteAsync(userId, recipeId, recipeName);
		}
	};

	useEffect(() => {
		if (!currentRecipe.recipeId) {
			navigate("/");
		}

		console.log(favorites);
		console.log(currentRecipe);
	}, []);

	const containsFavoritesWithRecipeId = (
		favorites: FavoriteState[],
		recipeId: string
	) => {
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
		navigate("/editRecipe");
	};

	const handleDeleteRecipe = () => {
		if (window.confirm("削除しますか？")) {
			deleteFirebaseDocument();
		}
		navigate("/");
	};

	const deleteFirebaseDocument = async () => {
		if (currentRecipe.recipeId) {
			await deleteDoc(doc(db, "recipes", currentRecipe.recipeId))
				.then(() => {
					console.log("recipe delete successfully");
				})
				.catch((error) => {
					error && console.error("recipe delete feild: ", error);
				});
		}
		if (currentRecipe.recipeImageUrl) {
			const desertRef = ref(storage, currentRecipe.recipeImageUrl);

			deleteObject(desertRef)
				.then(() => {
					console.log("file delete successfully");
				})
				.catch((error) => {
					error && console.error("file delete faild :", error);
				});
		}
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
							className="recipeHeaderLike"
							onClick={() =>
								user?.uid &&
								currentRecipe.recipeId &&
								currentRecipe.recipeName &&
								handleToggleFavorite(
									user.uid,
									currentRecipe.recipeId,
									currentRecipe.recipeName
								)
							}
						>
							{currentRecipe.recipeId &&
							containsFavoritesWithRecipeId(
								favorites,
								currentRecipe.recipeId
							) ? (
								<FavoriteIcon className="recipeHeaderLikeIcon" />
							) : (
								<FavoriteBorderIcon className="recipeHeaderLikeIcon" />
							)}

							<span>10</span>
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
