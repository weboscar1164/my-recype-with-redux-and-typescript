import React, { useEffect, useState } from "react";
import "./RecipeList.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { QuerySnapshot, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

const recipeList = () => {
	interface RecipeListItem {
		recipeName: string;
		recipeImageUrl: string;
		recipeId: string;
	}

	const [recipeList, setRecipeList] = useState<RecipeListItem[]>([]);
	useEffect(() => {
		getRecipeList();
	}, []);

	const getRecipeList = async () => {
		setRecipeList([]);

		const q = query(collection(db, "recipes"));

		const querySnapshot = await getDocs(q);
		const recipes: RecipeListItem[] = [];
		querySnapshot.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
			recipes.push({
				recipeName: doc.data().recipeName,
				recipeImageUrl: doc.data().recipeImageUrl,
				recipeId: doc.id,
			});
		});
		setRecipeList(recipes);
	};

	const getRecipeImage = (recipeImageUrl: string) => {
		console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "noimage.jpg";
	};
	return (
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>レシピ一覧</h2>
				<ul>
					{recipeList &&
						recipeList.map((item) => (
							<li key={item.recipeId}>
								<div className="recipeListItemLeft">
									<div className="recipeListImg">
										<img src={getRecipeImage(item.recipeImageUrl)} alt="" />
									</div>
									<h3>{item.recipeName}</h3>
								</div>
								<div className="recipeListLike">
									<FavoriteBorderIcon className="recipeListLikeIcon" />
									<span>10</span>
								</div>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default recipeList;
