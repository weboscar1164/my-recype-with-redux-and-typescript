import "./EditRecipe.scss";
import AddIcon from "@mui/icons-material/Add";

const EditRecipe = () => {
	return (
		<div className="editRecipe">
			<h2>レシピ編集</h2>
			<form className="editRecipeForm">
				<ul className="editRecipeFormHeader">
					<li>
						<label htmlFor="recipeName">レシピ名</label>
						<input type="text" id="recipeName" />
					</li>
					<li>
						<label htmlFor="recipeImg">完成画像</label>
						<input type="file" id="recipeImg" />
					</li>
					<li>
						<label htmlFor="recipeInfo">コメント</label>
						<input type="text" id="recipeInfo" />
					</li>
				</ul>
				<ul className="editRecipeFormMaterial">
					<li>
						<div>材料１</div>
						<div>
							<label htmlFor="material01">名前</label>
							<input type="text" id="material01" />
						</div>
						<div>
							<label htmlFor="quantity01">分量</label>
							<input type="text" id="quantity01" />
						</div>
						<div>
							<label htmlFor="group01">グループ</label>
							<select name="group01" id="group01">
								<option value="0"></option>
								<option value="1">★</option>
								<option value="2">☆</option>
								<option value="3">●</option>
								<option value="4">○</option>
								<option value="5">◎</option>
							</select>
						</div>
					</li>
					<li>
						<div>材料2</div>
						<div>
							<label htmlFor="material02">名前</label>
							<input type="text" id="material02" />
						</div>
						<div>
							<label htmlFor="quantity02">分量</label>
							<input type="text" id="quantity02" />
						</div>
						<div>
							<label htmlFor="group02">グループ</label>
							<select name="group02" id="group02">
								<option value="0"></option>
								<option value="1">★</option>
								<option value="2">☆</option>
								<option value="3">●</option>
								<option value="4">○</option>
								<option value="5">◎</option>
							</select>
						</div>
					</li>
				</ul>

				<div className="editRecipeFormMaterialAdd">
					<div className="editRecipeFormMaterialAddIcon">
						<AddIcon />
					</div>
				</div>
				<h3>作り方</h3>
				<ol className="editRecipeFormProcedure">
					<li>
						<input type="text" id="procedure01" />
					</li>
					<li>
						<input type="text" id="procedure02" />
					</li>
				</ol>
				<div className="editRecipeFormProcedureAdd">
					<div className="editRecipeFormProcedureAddIcon">
						<AddIcon />
					</div>
				</div>
			</form>
		</div>
	);
};

export default EditRecipe;
