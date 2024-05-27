import "./Recipe.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Tooltip } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

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

	const navigate = useNavigate();

	useEffect(() => {
		if (JSON.stringify(currentRecipe) === JSON.stringify(initialState)) {
			navigate("/");
		}
		console.log(currentRecipe);
	}, []);

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
		if (currentRecipe.recipeId && currentRecipe.recipeImageUrl) {
			await deleteDoc(doc(db, "recipes", currentRecipe.recipeId));
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
					<Tooltip title="いいね！">
						<div className="recipeHeaderLike">
							<FavoriteBorderIcon className="recipeHeaderLikeIcon" />
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
