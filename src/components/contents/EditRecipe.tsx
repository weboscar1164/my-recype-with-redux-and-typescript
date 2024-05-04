import "./EditRecipe.scss";
import AddIcon from "@mui/icons-material/Add";

const EditRecipe = () => {
	return (
		<div className="editRecipe">
			<div className="editRecipeContainer">
				<form className="editRecipeForm">
					<h2>レシピ編集</h2>
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
							<textarea id="recipeInfo" />
						</li>
					</ul>
					<h3>材料</h3>
					<ul className="editRecipeFormMaterial">
						<li>
							<div className="editRecipeFormMaterialTitle">材料１</div>
							<div className="editRecipeFormMaterialContent">
								<label htmlFor="material01">名前</label>
								<input type="text" id="material01" />
							</div>
							<div className="editRecipeFormMaterialContent">
								<label htmlFor="quantity01">分量</label>
								<input type="text" id="quantity01" />
							</div>
							<div className="editRecipeFormMaterialContent">
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
							<div className="editRecipeFormMaterialTitle">材料2</div>
							<div className="editRecipeFormMaterialContent">
								<label htmlFor="material02">名前</label>
								<input type="text" id="material02" />
							</div>
							<div className="editRecipeFormMaterialContent">
								<label htmlFor="quantity02">分量</label>
								<input type="text" id="quantity02" />
							</div>
							<div className="editRecipeFormMaterialContent">
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

					<div className="editRecipeFormAdd">
						<div className="editRecipeFormAddIcon">
							<AddIcon />
						</div>
					</div>
					<h3>作り方</h3>
					<ul className="editRecipeFormProcedure">
						<li>
							<div>作り方1</div>
							<textarea id="procedure01" />
						</li>
						<li>
							<div>作り方2</div>
							<textarea id="procedure02" />
						</li>
					</ul>
					<div className="editRecipeFormAdd">
						<div className="editRecipeFormAddIcon">
							<AddIcon />
						</div>
					</div>

					<div className="editRecipeFormSubmit">
						<button type="submit">確認</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditRecipe;
