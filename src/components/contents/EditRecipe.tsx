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
	const [materials, setMaterials] = useState<Material[]>([
		{ name: "", quantity: "", group: 0 },
	]);
	const [procedures, setProcedures] = useState<string[]>([""]);
	const [errors, setErrors] = useState<any>({});
	const [validateOnSubmit, setVaridateOnSubmit] = useState<boolean>(false);

	//追加したフォームを参照
	const recipeNameRef = useRef<HTMLInputElement>(null);
	const materialRef = useRef<HTMLDivElement>(null);
	const procedureRef = useRef<HTMLDivElement>(null);

	const recipeInfo = useAppSelector((state) => state.recipe);

	// useEffect(() => {

	// },[])

	//再編集のためのstate取得
	useEffect(() => {
		console.log("render");
		if (recipeInfo) {
			setRecipe({
				recipeName: recipeInfo.recipeName || "",
				recipeImage: recipeInfo.recipeImage || "",
				comment: recipeInfo.comment || "",
				serves: recipeInfo.serves || 1,
			});
		}
		if (recipeInfo.materials && recipeInfo.materials.length !== 0) {
			setMaterials(recipeInfo.materials);
		}
		if (recipeInfo.procedures && recipeInfo.procedures.length !== 0) {
			setProcedures(recipeInfo.procedures);
		}
	}, [recipeInfo]);

	// material,procedure追加時にフォーカスを調整する
	useEffect(() => {
		if (materials.length > 1 || procedures.length > 1) {
			focusMaterialFormInput(materials.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [materials.length]);

	useEffect(() => {
		if (materials.length > 1 || procedures.length > 1) {
			focusProcedureFormInput(procedures.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [procedures.length]);

	//change
	const handleChangeRecipe = (value: string | number, key: string) => {
		const newRecipe: Recipe = { ...recipe, [key]: value };
		// console.log(newRecipe);
		setRecipe(newRecipe);
		if (validateOnSubmit) {
			console.log("validate");
			const newErrors = { ...errors };
			validateRecipe(newRecipe, newErrors);
			setErrors(newErrors);
		}
	};

	// ファイルのinput要素でファイルが選択されたときの処理
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.readyState === 2) {
					setRecipe((prevRecipe) => ({
						...prevRecipe,
						recipeImage: reader.result as string, // ファイルのデータを文字列としてセット
					}));
				}
			};
			reader.readAsDataURL(file); // ファイルの内容をBase64形式の文字列として読み込む
		}
	};

	const handleChangeMaterial = (
		value: string | number,
		key: string,
		index: number
	) => {
		console.log(materials);
		setMaterials((prevMaterials) => {
			const newMaterials: Material[] = prevMaterials.map((material, i) =>
				i === index ? { ...material, [key]: value } : material
			);

			if (validateOnSubmit) {
				const newErrors = { ...errors };
				validateMaterial(newMaterials, newErrors);
				setErrors(newErrors);
			}
			return newMaterials;
		});
	};

	const handleChangeProcedure = (index: number, value: string) => {
		const newProcedure = [...procedures];
		newProcedure[index] = value;
		// console.log(procedure);
		setProcedures(newProcedure);
		if (validateOnSubmit) {
			const newErrors = { ...errors };
			validateProcedure(procedures, newErrors);
			setErrors(newErrors);
		}
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

	//フォーム追加
	const handleAddMaterial = () => {
		setMaterials([...materials, { name: "", quantity: "", group: 0 }]);
	};

	const handleAddProcedure = () => {
		setProcedures([...procedures, ""]);
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

	//フォーム削除
	const handleCloseMaterial = (index: number) => {
		const newMaterials = [
			...materials.slice(0, index),
			...materials.slice(index + 1),
		];
		// console.log(newMaterials);
		setMaterials(newMaterials);
	};

	const handleCloseProcedure = (index: number) => {
		console.log(procedures);
		const newProcedures = [
			...procedures.slice(0, index),
			...procedures.slice(index + 1),
		];
		// console.log(newProcedure);
		setProcedures(newProcedures);
	};

	//setRecipeSlice
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setVaridateOnSubmit(true);
		if (validateForm()) {
			handleSetRecipeSlice();
		}
	};

	const handleSetRecipeSlice = () => {
		const newRecipe: InitialRecipeState = {
			recipeName: recipe.recipeName,
			recipeImage: recipe.recipeImage,
			comment: recipe.comment,
			serves: recipe.serves,
			materials: materials,
			procedures: procedures,
		};

		console.log(newRecipe);
		dispatch(setRecipeInfo(newRecipe));
		navigate("/confirm");
	};

	//バリデーション
	const validateRecipe = (recipe: Recipe, newErrors: any) => {
		if (
			!recipe.recipeName ||
			recipe.recipeName.length < 3 ||
			recipe.recipeName.length > 50
		) {
			newErrors.recipeName = "レシピ名は３～５０文字で入力してください";
		} else {
			delete newErrors.recipeName;
		}
		if (recipe.comment.length > 200) {
			newErrors.comment = "コメントは２００文字以内で入力してください";
		} else {
			delete newErrors.comment;
		}
	};

	const validateMaterial = (materials: Material[], newErrors: any) => {
		materials.forEach((material, index) => {
			if (!material.name) {
				newErrors[`materialName${index}`] = "材料名を入力してください";
			} else {
				delete newErrors[`materialName${index}`];
			}
			if (!material.quantity) {
				newErrors[`materialQuantity${index}`] = "材料の分量を入力してください";
			} else {
				delete newErrors[`materialQuantity${index}`];
			}
		});
	};

	const validateProcedure = (procedures: string[], newErrors: any) => {
		procedures.forEach((procedure, index) => {
			if (!procedure) {
				newErrors[`procedure${index}`] = "作り方を入力してください";
			} else {
				delete newErrors[`procedure${index}`];
			}
		});
		setErrors((prevErrors: any) => ({ ...prevErrors, ...errors }));
	};

	const validateForm = () => {
		const newErrors: any = {};
		validateRecipe(recipe, newErrors);
		validateMaterial(materials, newErrors);
		validateProcedure(procedures, newErrors);

		console.log(newErrors);
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
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
							{errors.recipeName && (
								<span className="validationError">{errors.recipeName}</span>
							)}
						</li>
						<li>
							<label htmlFor="recipeImg">完成画像</label>
							<input
								type="file"
								id="recipeImg"
								name="recipeImg"
								onChange={(e) => handleImageChange(e)}
							/>
						</li>
						{recipe.recipeImage && (
							<img src={recipe.recipeImage} alt="Recipe Image" />
						)}
						<li>
							<label htmlFor="comment">コメント</label>

							<input
								id="comment"
								name="comment"
								onChange={(e) => handleChangeRecipe(e.target.value, "comment")}
								value={recipe.comment}
							/>
							{errors.comment && (
								<span className="validationError">{errors.comment}</span>
							)}
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
							{materials.length === 0 ? (
								<p className="editRecipeFormMaterialNotice">
									材料を追加してください。
								</p>
							) : (
								materials.map((material, index) => (
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
												value={material.name}
												onChange={(e) =>
													handleChangeMaterial(e.target.value, "name", index)
												}
												onKeyDown={(e) => handleKeyDown(e)}
											/>
										</div>
										{errors[`materialName${index}`] && (
											<span className="validationError">
												{errors[`materialName${index}`]}
											</span>
										)}
										<div className="editRecipeFormMaterialBottom">
											<div className="editRecipeFormMaterialContent">
												<label htmlFor="quantity">分量</label>
												<input
													type="text"
													id="quantity"
													name="quantity"
													value={material.quantity}
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
													value={material.group}
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
										{errors[`materialQuantity${index}`] && (
											<span className="validationError">
												{errors[`materialQuantity${index}`]}
											</span>
										)}
									</li>
								))
							)}
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
							{procedures.length === 0 ? (
								<p className="editRecipeFormProcedureNotice">
									作り方を入力してください。
								</p>
							) : (
								procedures.map((procedure, index) => (
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
											value={procedure}
											onChange={(e) =>
												handleChangeProcedure(index, e.target.value)
											}
											onKeyDown={(e) => handleKeyDown(e)}
										/>
										{errors[`procedure${index}`] && (
											<span className="validationError">
												{errors[`procedure${index}`]}
											</span>
										)}
									</li>
								))
							)}
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
