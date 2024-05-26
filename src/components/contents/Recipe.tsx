import "./Recipe.scss";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
	const currentRecipe = useAppSelector((state) => state.recipe);
	const navigate = useNavigate();
	useEffect(() => {
		if (JSON.stringify(currentRecipe) === JSON.stringify(initialState)) {
			navigate("/");
		}
	}, []);

	const getRecipeImage = (recipeImageUrl: string | null) => {
		// console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "noimage.jpg";
	};

	const getGroupIcon = (value: number) => {
		const symbols = ["", "★", "☆", "●", "○", "◎"];
		return symbols[value] || "";
	};

	return (
		<div className="recipe">
			<div className="recipeContainer">
				<h2>{currentRecipe.recipeName}</h2>
				<div className="recipeHeader">
					<div className="recipeHeaderAuther">
						{currentRecipe.userDisprayName}
					</div>
					<div className="recipeHeaderLike">
						<FavoriteBorderIcon className="recipeHeaderLikeIcon" />
						<span>10</span>
					</div>
					<EditIcon />
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
