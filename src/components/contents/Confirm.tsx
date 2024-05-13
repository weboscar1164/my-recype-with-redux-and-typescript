import "./Recipe.scss";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import Recipe from "./Recipe";

const Confirm = () => {
	const naviate = useNavigate();
	const recipeInfo = useAppSelector((state) => state.recipe);
	console.log(recipeInfo);

	const handleReEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		naviate("/editrecipe");
	};

	const setGroupIcon = (value: number) => {
		let symbol = "";
		switch (value) {
			case 1:
				symbol = "★";
				break;
			case 2:
				symbol = "☆";
				break;
			case 3:
				symbol = "●";
				break;
			case 4:
				symbol = "○";
				break;
			case 5:
				symbol = "◎";
				break;
			default:
				symbol = "";
				break;
		}
		return symbol;
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
					<img src="20200501_noimage.jpg" alt="" />
				</p>
				<section className="recipeInfo">
					<h3>Comment</h3>
					<p>{recipeInfo.comment}</p>
				</section>

				<section className="recipeMaterial">
					<h3>材料{recipeInfo.serves}人分</h3>
					<ul>
						{recipeInfo.material &&
							recipeInfo.material.map((item, index) => (
								<li key={index}>
									<div className="recipeMaterialGroup">
										{setGroupIcon(item.group)}
									</div>
									<div className="recipeMaterialContents">
										<div className="recipeMaterialName">{item.name}</div>
										<div className="recipeMaterialQuantity">
											{item.quantity}
										</div>
									</div>
								</li>
							))}
					</ul>
				</section>

				<section className="recipeProcedure">
					<h3>作り方</h3>
					<ol>
						{recipeInfo.procedure &&
							recipeInfo.procedure.map((item, index) => (
								<li key={index}>{item}</li>
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
