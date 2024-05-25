import React, { useEffect } from "react";
import "./RecipeList.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { QuerySnapshot, collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

const recipeList = () => {
	useEffect(() => {
		getRecipeList();
	}, []);

	const getRecipeList = async () => {
		const q = query(collection(db, "recipes"));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
		});
	};
	return (
		<div className="recipeList">
			<div className="recipeListContainer">
				<h2>レシピ一覧</h2>
				<ul>
					<li>
						<div className="recipeListItemLeft">
							<div className="recipeListImg">
								<img src="pexels-catscoming-674574.jpg" alt="" />
							</div>
							<h3>カレー</h3>
						</div>
						<div className="recipeListLike">
							<FavoriteBorderIcon className="recipeListLikeIcon" />
							<span>10</span>
						</div>
					</li>
					<li>
						<div className="recipeListItemLeft">
							<div className="recipeListImg">
								<img src="pexels-catscoming-674574.jpg" alt="" />
							</div>
							<h3>カレー</h3>
						</div>
						<div className="recipeListLike">
							<FavoriteBorderIcon className="recipeListLikeIcon" />
							<span>10</span>
						</div>
					</li>
					<li>
						<div className="recipeListItemLeft">
							<div className="recipeListImg">
								<img src="pexels-catscoming-674574.jpg" alt="" />
							</div>
							<h3>北海道の野菜たっぷりチキンカレー</h3>
						</div>
						<div className="recipeListLike">
							<FavoriteBorderIcon className="recipeListLikeIcon" />
							<span>10</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default recipeList;
