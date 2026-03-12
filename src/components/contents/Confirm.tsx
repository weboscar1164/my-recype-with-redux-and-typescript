import "./Recipe.scss";
import {
	useAppDispatch,
	useAppSelector,
	usetagSuggestions,
} from "../../app/hooks/hooks";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useUploadRecipe } from "../../app/hooks/useUploadRecipe";
import { openPopup } from "../../features/popupSlice";
import { InitialRecipeState } from "../../Types";

const Confirm = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [searchParams] = useSearchParams();
	const pageFromUrl = Number(searchParams.get("page")) || 1;

	const location = useLocation();
	const recipeInfo: InitialRecipeState = location.state?.confirmData;
	const isAdminMode = useAppSelector((state) => state.pageStatus.isAdminMode);

	const { uploadRecipeToFirestore } = useUploadRecipe();
	const { addTagSuggestions } = usetagSuggestions();

	useEffect(() => {
		if (!location.state) {
			navigate("/recipes/new");
		}
	}, [recipeInfo, location.state]);

	const handleReEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		!recipeInfo.recipeId
			? navigate("/recipes/new", { state: recipeInfo })
			: navigate(`/recipes/${recipeInfo.recipeId}/edit?page=${pageFromUrl}`, {
					state: { reEdit: recipeInfo },
				});
	};

	const getGroupIcon = (value: number) => {
		const symbols = ["", "★", "☆", "●", "○", "◎"];
		return symbols[value] || "";
	};

	const getIsPublic = (value: number) => {
		const currentPublic = ["非公開", "公開"];
		return currentPublic[value] || "";
	};

	const getRecipeImage = () => {
		return recipeInfo.recipeImageUrl
			? recipeInfo.recipeImageUrl
			: "/noimage.jpg";
	};

	const handleRecipeSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const popupMessage = !recipeInfo.recipeId
			? "レシピを作成しました。"
			: "レシピを更新しました。";

		try {
			await uploadRecipeToFirestore();
			if (recipeInfo.tags) {
				await addTagSuggestions(recipeInfo.tags);
			}
			if (isAdminMode) {
				navigate("/admin");
			} else {
				navigate("/");
			}
			dispatch(openPopup({ message: popupMessage, action: "success" }));
		} catch (error) {
			dispatch(
				openPopup({
					message: "レシピのアップデートに失敗しました。",
					action: "notice",
				}),
			);
			console.error("レシピのアップデートに失敗しました: ", error);
		}
	};
	console.log("recipeinfo: ", recipeInfo);

	return (
		<div className="recipe">
			<div className="container recipeContainer">
				<h2>確認画面</h2>
				<h3>{recipeInfo.recipeName}</h3>
				<div className="recipeTag">
					{recipeInfo.tags && recipeInfo.tags[0] !== "" ? (
						<ul>
							{recipeInfo.tags &&
								recipeInfo.tags.map((tag, index) => <li key={index}>{tag}</li>)}
						</ul>
					) : (
						""
					)}
				</div>
				<div>{getIsPublic(recipeInfo.isPublic)}</div>
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
							recipeInfo.materials.map((material) => (
								<li key={material.id}>
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
					<button
						className="button"
						onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
							handleRecipeSubmit(e)
						}
					>
						確定
					</button>
					<button className="button" onClick={(e) => handleReEdit(e)}>
						再編集
					</button>
				</div>
			</div>
		</div>
	);
};

export default Confirm;
