import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import "./EditRecipe.scss";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { InitialRecipeState } from "../../Types";
import { setRecipeInfo } from "../../features/recipeSlice";
import { useNavigate } from "react-router-dom";

const EditRecipe = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	interface Recipe {
		recipeName: string;
		recipeImage: string;
		comment: string;
		serves: number;
	}

	interface Material {
		name: string;
		quantity: string;
		group: number;
	}

	const [recipe, setRecipe] = useState<Recipe>({
		recipeName: "",
		recipeImage: "",
		comment: "",
		serves: 1,
	});
	const [material, setMaterial] = useState<Material[]>([
		{ name: "", quantity: "", group: 0 },
	]);
	const [procedure, setProcedure] = useState<string[]>([""]);

	//追加したフォームを参照
	const recipeNameRef = useRef<HTMLInputElement>(null);
	const materialRef = useRef<HTMLDivElement>(null);
	const procedureRef = useRef<HTMLDivElement>(null);

	const recipeInfo = useAppSelector((state) => state.recipe);

	useEffect(() => {
		if (recipeInfo) {
			setRecipe({
				recipeName: recipeInfo.recipeName || "",
				recipeImage: recipeInfo.recipeImage || "",
				comment: recipeInfo.comment || "",
				serves: recipeInfo.serves || 1,
			});
		}
		if (recipeInfo.material && recipeInfo.material.length !== 0) {
			setMaterial(recipeInfo.material);
		}
		if (recipeInfo.procedure && recipeInfo.procedure.length !== 0) {
			setProcedure(recipeInfo.procedure);
		}
	}, [recipeInfo]);

	useEffect(() => {
		if (material.length > 1 || procedure.length > 1) {
			focusMaterialFormInput(material.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [material.length]);

	useEffect(() => {
		if (material.length > 1 || procedure.length > 1) {
			focusProcedureFormInput(procedure.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [procedure.length]);

	//change
	const handleChangeRecipe = (value: string | number, key: string) => {
		const newRecipe: Recipe = { ...recipe, [key]: value };
		// console.log(newRecipe);
		setRecipe(newRecipe);
	};

	const handleChangeMaterial = (
		value: string | number,
		key: string,
		index: number
	) => {
		const newMaterial: Material[] = [...material];
		newMaterial[index] = { ...newMaterial[index], [key]: value };
		console.log(newMaterial);
		setMaterial(newMaterial);
	};

	const handleChangeProcedure = (index: number, value: string) => {
		const newProcedure = [...procedure];
		newProcedure[index] = value;
		// console.log(procedure);
		setProcedure(newProcedure);
	};

	//Enterを押下したときに項目を追加する
	const handleKeyDown = (
		e: React.KeyboardEvent<
			| HTMLInputElement
			| HTMLTextAreaElement
			| HTMLSelectElement
			| HTMLDivElement
		>
	) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Enter キーのデフォルト動作を防止
			if (materialRef.current?.contains(e.target as Node)) {
				handleAddMaterial();
			} else if (procedureRef.current?.contains(e.target as Node)) {
				handleAddProcedure();
			}
		}
	};

	//add form
	const handleAddMaterial = () => {
		setMaterial([...material, { name: "", quantity: "", group: 0 }]);
	};

	const handleAddProcedure = () => {
		setProcedure([...procedure, ""]);
	};

	//追加したフォームにフォーカスを当てる
	const focusMaterialFormInput = (index: number) => {
		console.log(materialRef);
		console.log(index);
		if (materialRef.current) {
			const input = materialRef.current.querySelector(
				`li:nth-child(${index}) input`
			);
			console.log(input);
			if (input) {
				(input as HTMLElement).focus();
			}
		}
	};
	const focusProcedureFormInput = (index: number) => {
		if (procedureRef.current) {
			const input = procedureRef.current.querySelector(
				`li:nth-child(${index}) input`
			);
			if (input) {
				(input as HTMLElement).focus();
			}
		}
	};

	//close
	const handleCloseMaterial = (index: number) => {
		const newMaterial = [
			...material.slice(0, index),
			...material.slice(index + 1),
		];
		// console.log(newMaterial);
		setMaterial(newMaterial);
	};

	const handleCloseProcedure = (index: number) => {
		console.log(procedure);
		const newProcedure = [
			...procedure.slice(0, index),
			...procedure.slice(index + 1),
		];
		// console.log(newProcedure);
		setProcedure(newProcedure);
	};

	//setRecipeSlice
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleSetRecipeSlice();
	};

	const handleSetRecipeSlice = () => {
		const newRecipe: InitialRecipeState = {
			recipeName: recipe.recipeName,
			recipeImage: recipe.recipeImage,
			comment: recipe.comment,
			serves: recipe.serves,
			material: material,
			procedure: procedure,
		};

		console.log(newRecipe);
		dispatch(setRecipeInfo(newRecipe));
		navigate("/confirm");
	};
	return (
		<div className="editRecipe">
			<div className="editRecipeContainer">
				<form className="editRecipeForm" onSubmit={handleSubmit}>
					<h2>レシピ編集</h2>
					<ul className="editRecipeFormHeader">
						<li>
							<label htmlFor="recipeName">レシピ名</label>
							<input
								type="text"
								id="recipeName"
								name="recipeName"
								onChange={(e) =>
									handleChangeRecipe(e.target.value, "recipeName")
								}
								ref={recipeNameRef}
								value={recipe.recipeName}
							/>
						</li>
						<li>
							<label htmlFor="recipdeImg">完成画像</label>
							<input
								type="file"
								id="recipeImg"
								name="recipeImg"
								onChange={(e) =>
									handleChangeRecipe(e.target.value, "recipeImage")
								}
								value={recipe.recipeImage}
							/>
						</li>
						<li>
							<label htmlFor="comment">コメント</label>
							<input
								id="comment"
								name="comment"
								onChange={(e) => handleChangeRecipe(e.target.value, "comment")}
								value={recipe.comment}
							/>
						</li>
					</ul>
					<h3>材料</h3>
					<div className="editRecipeFormServes">
						<select
							name="serves"
							id="serves"
							onChange={(e) => handleChangeRecipe(e.target.value, "serves")}
							value={recipe.serves}
						>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
						</select>
						<span>人分</span>
					</div>
					<div className="editRecipeFormMaterial" ref={materialRef}>
						<ul>
							{material.map((item, index) => (
								<li key={index}>
									<div
										className="editRecipeFormMaterialClose"
										onClick={() => handleCloseMaterial(index)}
									>
										<CloseIcon />
									</div>
									<div className="editRecipeFormMaterialTitle">
										材料{index + 1}
									</div>
									<div className="editRecipeFormMaterialContent">
										<label htmlFor="name">名前</label>
										<input
											type="text"
											id="name"
											name="name"
											value={item.name}
											onChange={(e) =>
												handleChangeMaterial(e.target.value, "name", index)
											}
											onKeyDown={(e) => handleKeyDown(e)}
										/>
									</div>
									<div className="editRecipeFormMaterialBottom">
										<div className="editRecipeFormMaterialContent">
											<label htmlFor="quantity">分量</label>
											<input
												type="text"
												id="quantity"
												name="quantity"
												value={item.quantity}
												onChange={(e) =>
													handleChangeMaterial(
														e.target.value,
														"quantity",
														index
													)
												}
												onKeyDown={(e) => handleKeyDown(e)}
											/>
										</div>
										<div className="editRecipeFormMaterialContent">
											<label htmlFor="group">グループ</label>
											<select
												name="group"
												id="group"
												value={item.group}
												onChange={(e) =>
													handleChangeMaterial(e.target.value, "group", index)
												}
												onKeyDown={(e) => handleKeyDown(e)}
											>
												<option value="0"></option>
												<option value="1">★</option>
												<option value="2">☆</option>
												<option value="3">●</option>
												<option value="4">○</option>
												<option value="5">◎</option>
											</select>
										</div>
									</div>
								</li>
							))}
						</ul>

						<div className="editRecipeFormAdd">
							<div
								className="editRecipeFormAddIcon"
								onClick={handleAddMaterial}
								onKeyDown={(e) => handleKeyDown(e)}
								tabIndex={0}
							>
								<Tooltip title="追加">
									<AddIcon />
								</Tooltip>
							</div>
						</div>
					</div>
					<h3>作り方</h3>
					<div className="editRecipeFormProcedure" ref={procedureRef}>
						<ul>
							{procedure.map((item, index) => (
								<li key={index}>
									<div
										className="editRecipeFormProcedureClose"
										onClick={() => handleCloseProcedure(index)}
									>
										<CloseIcon />
									</div>
									<div className="editRecipeFormProcedureTitle">
										作り方{index + 1}
									</div>
									<input
										id={`procedure${index + 1}`}
										name={`procedure${index + 1}`}
										value={item}
										onChange={(e) =>
											handleChangeProcedure(index, e.target.value)
										}
										onKeyDown={(e) => handleKeyDown(e)}
									/>
								</li>
							))}
						</ul>
						<div className="editRecipeFormAdd">
							<div
								className="editRecipeFormAddIcon"
								onClick={handleAddProcedure}
								onKeyDown={(e) => handleKeyDown(e)}
								tabIndex={0}
							>
								<Tooltip title="追加">
									<AddIcon />
								</Tooltip>
							</div>
						</div>
					</div>

					<div className="editRecipeFormSubmit">
						<button type="submit">確認画面に進む</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditRecipe;
