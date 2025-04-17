import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import "./EditRecipe.scss";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { InitialRecipeState } from "../../Types";
import { setRecipeInfo } from "../../features/recipeSlice";
import { useNavigate } from "react-router-dom";
import { openPopup } from "../../features/popupSlice";

const EditRecipe = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	interface Recipe {
		recipeId?: string;
		tags: string[];
		isPublic: number;
		recipeName: string;
		recipeImageUrl: string;
		comment: string;
		serves: number;
	}

	interface Material {
		name: string;
		quantity: string;
		group: number;
	}
	interface JsonData {
		[key: string]: any;
	}

	const recipeInfo = useAppSelector((state) => state.recipe);

	const [recipe, setRecipe] = useState<Recipe>({
		recipeId: "",
		tags: [],
		isPublic: 1,
		recipeName: "",
		recipeImageUrl: "",
		comment: "",
		serves: 1,
	});
	const [jsonData, setJsonData] = useState<JsonData | null>(null);
	const [tags, setTags] = useState<string[]>([""]);
	const [materials, setMaterials] = useState<Material[]>([
		{ name: "", quantity: "", group: 0 },
	]);
	const [procedures, setProcedures] = useState<string[]>([""]);
	const [errors, setErrors] = useState<any>({});
	const [imgErrors, setImgErrors] = useState<any>({});
	const [fileErrors, setFileErrors] = useState<any>({});
	const [validateOnSubmit, setVaridateOnSubmit] = useState<boolean>(false);
	const [preview, setPreview] = useState<string>("");
	const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

	const fileInputRef = useRef<HTMLInputElement>(null);

	//追加したフォームを参照
	const recipeNameRef = useRef<HTMLInputElement>(null);
	const tagRef = useRef<HTMLInputElement>(null);
	const materialRef = useRef<HTMLDivElement>(null);
	const procedureRef = useRef<HTMLDivElement>(null);

	//再編集のためのstate取得
	useEffect(() => {
		if (recipeInfo) {
			setRecipe({
				recipeId: recipeInfo.recipeId || "",
				tags: recipeInfo.tags || [],
				isPublic: recipeInfo.isPublic || 1,
				recipeName: recipeInfo.recipeName || "",
				recipeImageUrl: recipeInfo.recipeImageUrl || "",
				comment: recipeInfo.comment || "",
				serves: recipeInfo.serves || 1,
			});
			setPreview(recipeInfo.recipeImageUrl || "");
		}

		if (recipeInfo.tags && recipeInfo.tags.length !== 0) {
			setTags(recipeInfo.tags);
		}

		if (recipeInfo.materials && recipeInfo.materials.length !== 0) {
			setMaterials(recipeInfo.materials);
		}

		if (recipeInfo.procedures && recipeInfo.procedures.length !== 0) {
			setProcedures(recipeInfo.procedures);
		}

		// 初回レンダリング時に最初のinputにフォーカスする
		if (isInitialRender) {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}

			// setMaterials,setProceduresが完了するまで時間差を設ける（非同期ではうまくいかなかった）
			setTimeout(() => {
				setIsInitialRender(false);
			}, 200);
		}
	}, [recipeInfo]);

	// tag,material,procedure追加時にフォーカスを調整する
	useEffect(() => {
		if (
			(!isInitialRender && tags.length > 1) ||
			(!isInitialRender && procedures.length > 1) ||
			(!isInitialRender && materials.length > 1)
		) {
			focusTagFormInput(tags.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [tags.length]);

	useEffect(() => {
		if (
			(!isInitialRender && tags.length > 1) ||
			(!isInitialRender && procedures.length > 1) ||
			(!isInitialRender && materials.length > 1)
		) {
			focusMaterialFormInput(materials.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [materials.length]);

	useEffect(() => {
		if (
			(!isInitialRender && tags.length > 1) ||
			(!isInitialRender && procedures.length > 1) ||
			(!isInitialRender && materials.length > 1)
		) {
			focusProcedureFormInput(procedures.length);
		} else {
			if (recipeNameRef.current) {
				recipeNameRef.current.focus();
			}
		}
	}, [procedures.length]);

	// JSONデータインポート時、編集画面に反映
	useEffect(() => {
		if (!jsonData) return;

		setRecipe({
			isPublic: recipe.isPublic,
			recipeName: jsonData.recipeName || "",
			tags: jsonData.tags || [],
			recipeImageUrl: jsonData.recipeImageUrl || "",
			comment: jsonData.comment || "",
			serves: jsonData.serves || 1,
		});
		setMaterials(jsonData.materials || []);
		setProcedures(jsonData.procedures || []);
	}, [jsonData]);

	//change
	const handleChangeRecipe = (
		value: string | number | File | null,
		key: string
	) => {
		const newRecipe: Recipe = { ...recipe, [key]: value };
		// console.log(newRecipe);
		setRecipe(newRecipe);
		if (validateOnSubmit) {
			const newErrors = { ...errors };
			validateRecipe(newRecipe, newErrors);
			setErrors(newErrors);
		}
	};

	//JSONファイルをインポートする
	const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		// 同じファイルを再選択したときにonchangeイベントを発火させるため、いちどinputをリセットする
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}

		console.log("file:", file);
		setFileErrors({});

		if (!file) {
			setFileErrors({ jsonError: ["ファイルが選択されていません"] });
			return;
		}

		if (file.type !== "application/json") {
			setFileErrors({ jsonError: ["JSONファイルを選択してください"] });
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const result = e.target?.result;
				console.log("result: ", result);
				if (typeof result === "string") {
					const parsedJson = JSON.parse(result);
					console.log("parsedJson: ", parsedJson);

					const validationErrors = validateJsonData(parsedJson);
					console.log(validationErrors);

					if (Object.keys(validationErrors).length > 0) {
						console.error("バリデーションエラー: ", validationErrors);
						setFileErrors({ jsonError: validationErrors });
						return;
					}
					setJsonData(parsedJson);
					console.log("setJson");
					setFileErrors({});
				}
			} catch (error) {
				console.error("JSONファイルのパースに失敗しました: ", error);
				setFileErrors({ jsonError: ["JSONの解析に失敗しました"] });
			}
		};
		reader.readAsText(file);

		if (jsonData) {
			// setRecipe(jsonData)
		}
	};

	// JSONデータのバリデーション
	const validateJsonData = (json: any) => {
		const errors: string[] = [];
		if (!json.recipeName || typeof json.recipeName !== "string") {
			errors.push("レシピ名が無効です");
		}

		if (!json.serves || typeof json.serves !== "number" || json.serves < 1) {
			errors.push("提供人数(serves)は１以上の数値である必要があります");
		}

		if (!Array.isArray(json.materials)) {
			errors.push("材料(materials)は配列である必要があります");
		}

		if (!Array.isArray(json.procedures)) {
			errors.push("手順(procedures)は配列である必要があります");
		}

		// materials の各要素チェック
		if (Array.isArray(json.materials)) {
			json.materials.forEach((item: any, index: number) => {
				if (
					typeof item.group !== "number" ||
					typeof item.name !== "string" ||
					typeof item.quantity !== "string"
				) {
					errors.push(`材料${index + 1}が無効です`);
				}
			});
		}
		return errors;
	};

	// imgファイルのinput処理
	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setRecipe((prevRecipe) => ({ ...prevRecipe, recipeImage: "" }));
		setPreview("");

		if (file) {
			// ファイルタイプが画像であることを確認
			const newImgErrors: any = {};
			if (!file.type.startsWith("image/")) {
				newImgErrors.notImg = "画像ファイルを選択してください。";
				setImgErrors(newImgErrors);
				return;
			} else {
				delete newImgErrors.notImg;
				setImgErrors(newImgErrors);
			}

			// ファイルサイズを2MB以下に制限
			const maxSyzeInBytes = 2 * 1024 * 1024; //2MB
			let processedFile = file;

			if (file.size > maxSyzeInBytes) {
				newImgErrors.sizeError =
					"画像サイズが大きいため、圧縮してアップロードします。";
				setImgErrors(newImgErrors);
				processedFile = await compressImage(file, 1024, 1024, 0.7);
			} else {
				delete newImgErrors.sizeError;
				setImgErrors(newImgErrors);
			}

			const reader = new FileReader();
			reader.onload = () => {
				if (reader.readyState === 2) {
					const filePath = URL.createObjectURL(file);
					setPreview(reader.result as string);
					handleChangeRecipe(filePath, "recipeImageUrl");
				}
			};
			reader.readAsDataURL(processedFile); // ファイルの内容をBase64形式の文字列として読み込む
		}
	};

	/**
	 * 画像を圧縮する関数
	 * @param file 圧縮する画像ファイル
	 * @param maxWidth 最大幅
	 * @param maxHeight 最大高さ
	 * @param quality 圧縮率 (0.1〜1.0)
	 * @returns 圧縮後のFileオブジェクト
	 */
	const compressImage = (
		file: globalThis.File,
		maxWidth: number,
		maxHeight: number,
		quality: number
	): Promise<globalThis.File> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const reader = new FileReader();

			// 画像の読み込みが失敗している場合
			reader.onerror = () =>
				reject(new Error("ファイルの読み込みに失敗しました。"));

			reader.onload = (e) => {
				if (!e.target?.result) {
					return reject(new Error("ファイルのデータが無効です。"));
				}
				img.src = e.target.result as string;
			};

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					return reject(new Error("canvasコンテキストの取得に失敗しました。"));
				}

				let { width, height } = img;
				if (width > maxWidth || height > maxHeight) {
					const ratio = Math.min(maxWidth / width, maxHeight / height);
					width *= ratio;
					height *= ratio;
				}

				canvas.width = width;
				canvas.height = height;

				ctx.drawImage(img, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						if (blob) {
							const compressedFile = new File([blob], file.name, {
								type: "image/jpeg",
							});
							resolve(compressedFile);
						} else {
							reject(new Error("画像の圧縮に失敗しました。"));
						}
					},
					"image/jpeg",
					quality
				);
			};

			img.onerror = () => reject(new Error("画像の読み込みに失敗しました。"));
			reader.readAsDataURL(file);
		});
	};

	const handleChangeTag = (index: number, value: string) => {
		const newTag = [...tags];
		newTag[index] = value;
		setTags(newTag);
		if (validateOnSubmit) {
			const newErrors = { ...errors };
			validateTags(tags, newErrors);
			setErrors(newErrors);
		}
	};

	const handleChangeMaterial = (
		value: string | number,
		key: string,
		index: number
	) => {
		// console.log(materials);
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
			} else if (tagRef.current?.contains(e.target as Node)) {
				handleAddTag();
			}
		}
	};

	//フォーム追加
	const handleAddTag = () => {
		setTags([...tags, ""]);
	};

	const handleAddMaterial = () => {
		setMaterials([...materials, { name: "", quantity: "", group: 0 }]);
	};

	const handleAddProcedure = () => {
		setProcedures([...procedures, ""]);
	};

	//追加したフォームにフォーカスを当てる
	const focusTagFormInput = (index: number) => {
		if (tagRef.current) {
			const input = tagRef.current.querySelector(
				`li:nth-child(${index}) input`
			);
			if (input) {
				(input as HTMLElement).focus();
			}
		}
	};

	const focusMaterialFormInput = (index: number) => {
		if (materialRef.current) {
			const input = materialRef.current.querySelector(
				`li:nth-child(${index}) input`
			);
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
	const handleCloseTag = (index: number) => {
		const newTags = [...tags.slice(0, index), ...tags.slice(index + 1)];
		setTags(newTags);
	};

	const handleCloseMaterial = (index: number) => {
		const newMaterials = [
			...materials.slice(0, index),
			...materials.slice(index + 1),
		];
		// console.log(newMaterials);
		setMaterials(newMaterials);
	};

	const handleCloseProcedure = (index: number) => {
		// console.log(procedures);
		const newProcedures = [
			...procedures.slice(0, index),
			...procedures.slice(index + 1),
		];
		// console.log(newProcedure);
		setProcedures(newProcedures);
	};

	// 「確認画面に行く」ボタンを押してバリデーションを実行
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setVaridateOnSubmit(true);
		if (validateForm()) {
			handleSetRecipeSlice();
		} else {
			dispatch(
				openPopup({ message: "入力内容を確認してください。", action: "notice" })
			);
		}
	};

	// 前のページに戻る
	const handleBackPage = () => {
		navigate(-1);
	};

	// recipesliceに登録して確認画面に行く
	const handleSetRecipeSlice = () => {
		const newRecipe: InitialRecipeState = {
			recipeId: recipe.recipeId,
			tags: tags,
			isPublic: recipe.isPublic,
			recipeName: recipe.recipeName,
			recipeImageUrl: recipe.recipeImageUrl,
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
	const validateRecipe = async (recipe: Recipe, newErrors: any) => {
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

	const validateTags = async (tags: string[], newErrors: any) => {
		const cleanedTags = tags.filter((tag) => tag.trim() !== "");
		console.log(cleanedTags);
		cleanedTags.forEach((tag, index) => {
			if (tag.length > 5) {
				newErrors[`tag${index}`] = "5文字以内で設定してください";
			} else {
				delete newErrors[`tag${index}`];
			}
		});
		setTags(cleanedTags);
		setErrors((prevErrors: any) => ({ ...prevErrors, ...errors }));
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
		validateTags(tags, newErrors);
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
					<h2>{!recipe.recipeId ? "レシピ作成" : "レシピ編集"}</h2>
					<ul className="editRecipeFormHeader">
						{/* inputFile */}
						{!recipe.recipeId && (
							<>
								<li className="editRecipeInputFileWrapper">
									<label
										className="button editRecipeInputFileButton"
										htmlFor="recipeJsonData"
									>
										ファイル取込
									</label>
									<input
										className="editRecipeInputFile"
										type="file"
										ref={fileInputRef}
										accept=".json"
										id="recipeJsonData"
										name="recipeJsonData"
										onChange={(e) => handleJsonChange(e)}
									/>
									{fileErrors.jsonError && (
										<span className="validationError">
											{fileErrors.jsonError}
										</span>
									)}
								</li>
							</>
						)}
						{/* recipeName */}
						<li>
							<label className="editRecipeFormLabel" htmlFor="recipeName">
								レシピ名
							</label>
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
						{/* public */}
						<li>
							<select
								name="isPublic"
								id="isPublic"
								onChange={(e) => handleChangeRecipe(e.target.value, "isPublic")}
								value={recipe.isPublic}
							>
								<option value="1">公開</option>
								<option value="0">非公開</option>
							</select>
						</li>
						{/* tags */}
						<li>
							<h3>タグ</h3>
							<div className="editRecipeFormTags" ref={tagRef}>
								<ul>
									{tags.map((tag, index) => (
										<li key={index}>
											<div className="editRecipeFormItem">
												<input
													id={`tag${index + 1}`}
													name={`tag${index + 1}`}
													value={tag}
													onChange={(e) =>
														handleChangeTag(index, e.target.value)
													}
													onKeyDown={(e) => handleKeyDown(e)}
												/>
												{tags.length !== 1 && (
													<div
														className="editRecipeFormTagsIcon"
														onClick={() => handleCloseTag(index)}
													>
														<CloseIcon />
													</div>
												)}
											</div>
											{errors[`tag${index}`] && (
												<span className="validationError">
													{errors[`tag${index}`]}
												</span>
											)}
										</li>
									))}
								</ul>
								{tags.length < 5 && (
									<div className="editRecipeFormAdd editRecipeFormTagsAdd">
										<div
											className="editRecipeFormAddIcon"
											onClick={handleAddTag}
											onKeyDown={(e) => handleKeyDown(e)}
											tabIndex={0}
										>
											<Tooltip title="追加">
												<AddIcon />
											</Tooltip>
										</div>
									</div>
								)}
							</div>
						</li>
						{/* image */}
						<li>
							<h3>完成画像</h3>
							<label
								className="button editRecipeInputImageButton"
								htmlFor="recipeImg"
							>
								ファイルを選択
							</label>
							<input
								className="editRecipeInputImage"
								type="file"
								id="recipeImg"
								name="recipeImg"
								onChange={(e) => handleImageChange(e)}
							/>
						</li>
						{/* imageInput */}
						{recipe.recipeImageUrl ? (
							<div className="editRecipeFormImg">
								<img src={preview} alt="Recipe Image" />
							</div>
						) : (
							<p>選択されていません</p>
						)}
						{imgErrors.notImg && (
							<span className="validationError">{imgErrors.notImg}</span>
						)}
						{imgErrors.sizeError && (
							<span className="validationError">{imgErrors.sizeError}</span>
						)}
						{/* comment */}
						<li>
							<label className="editRecipeFormLabel" htmlFor="comment">
								コメント
							</label>

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
					{/* material */}
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
					{/* materialItem */}
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
											<label htmlFor={`materialName${index}`}>名前</label>
											<input
												type="text"
												id={`materialName${index}`}
												name={`materialName${index}`}
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
												<label htmlFor={`quantity${index}`}>分量</label>
												<input
													type="text"
													id={`quantity${index}`}
													name={`quantity${index}`}
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
												<label htmlFor={`group${index}`}>グループ</label>
												<select
													name={`group${index}`}
													id={`group${index}`}
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
					{/* procedure */}
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
						<button className="button" type="submit">
							確認画面に
							<br className="brSmActive" />
							進む
						</button>
						<button className="button" type="button" onClick={handleBackPage}>
							前のページ
							<br className="brSmActive" />
							に戻る
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditRecipe;
