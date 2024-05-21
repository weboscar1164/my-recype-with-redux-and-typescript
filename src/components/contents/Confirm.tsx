import "./Recipe.scss";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import Recipe from "./Recipe";
import { InitialRecipeState } from "../../Types";
import { useEffect } from "react";
import { isInitialState } from "../../features/recipeSlice";

const Confirm = () => {
	const naviate = useNavigate();
	const recipeInfo: InitialRecipeState = useAppSelector(
		(state) => state.recipe
	);
	const initialStateCheck = isInitialState(recipeInfo);
	// console.log(recipeInfo);

	useEffect(() => {
		// initialStateであるかを判定してtrueならばeditRecipeにリダイレクト
		if (initialStateCheck) {
			naviate("/editRecipe");
		}
	}, []);

	const handleReEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		naviate("/editrecipe");
	};

	const getGroupIcon = (value: number) => {
		const symbols = ["", "★", "☆", "●", "○", "◎"];
		return symbols[value] || "";
	};

	const getRecipeImage = () => {
		return recipeInfo.recipeImage ? recipeInfo.recipeImage : "noimage.jpg";
	};

	return (
		<div className="recipe">
			<div className="recipeContainer">
				<h2>確認画面</h2>
				<h3>{recipeInfo.recipeName}</h3>
				{/* <div className="recipeTag">
					<ul>
						<li>ハンバーグ</li>
						<li>オーブン</li>
						<li>ひき肉</li>
					</ul>
				</div> */}
				<p className="recipeImg">
					<img src={getRecipeImage()} alt="" />
				</p>
				<section className="recipeInfo">
					<h3>Comment</h3>
					<p>
						{recipeInfo.comment === ""
							? "コメントはありません"
							: recipeInfo.comment}
					</p>
				</section>

				<section className="recipeMaterial">
					<h3>材料{recipeInfo.serves}人分</h3>
					<ul>
						{recipeInfo.materials &&
							recipeInfo.materials.map((material, index) => (
								<li key={index}>
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
						{recipeInfo.procedures &&
							recipeInfo.procedures.map((procedure, index) => (
								<li key={index}>{procedure}</li>
							))}
					</ol>
				</section>
				<div className="recipeSubmit">
					<button onClick={(e) => handleReEdit(e)}>再編集</button>
					<button>確定</button>
				</div>
			</div>
		</div>
	);
};

export default Confirm;
