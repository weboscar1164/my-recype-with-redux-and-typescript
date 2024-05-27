import "./Recipe.scss";
import {
	CollectionReference,
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { InitialRecipeState } from "../../Types";
import React, { useEffect } from "react";
import { isInitialState } from "../../features/recipeSlice";
import { db, storage } from "../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Confirm = () => {
	const naviate = useNavigate();
	const recipeInfo: InitialRecipeState = useAppSelector(
		(state) => state.recipe
	);
	const user = useAppSelector((state) => state.user.user);

	const initialStateCheck = isInitialState(recipeInfo);
	// console.log(recipeInfo);

	useEffect(() => {
		// initialStateであるかを判定してtrueならばeditRecipeにリダイレクト
		if (initialStateCheck) {
			naviate("/editRecipe");
		}
		console.log(recipeInfo);
	}, []);

	const handleReEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		naviate("/editrecipe");
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
		console.log(recipeInfo.recipeImageUrl);
		return recipeInfo.recipeImageUrl
			? recipeInfo.recipeImageUrl
			: "noimage.jpg";
	};

	const uploadRecipeToFirestore = async (
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		e.preventDefault();

		if (!user) {
			return;
		}

		let imageUrl = recipeInfo.recipeImageUrl || "";
		if (
			!imageUrl.startsWith("https://firebasestorage.googleapis.com/") &&
			imageUrl
		) {
			imageUrl = (await uploadImage(imageUrl)) || "";
		}

		if (!recipeInfo.recipeId) {
			console.log("added");
			const collectionRef = collection(
				db,
				"recipes"
			) as CollectionReference<InitialRecipeState>;

			await addDoc(collectionRef, {
				isPublic: recipeInfo.isPublic,
				recipeName: recipeInfo.recipeName,
				comment: recipeInfo.comment,
				user: user.uid,
				userDisprayName: user.displayName,
				recipeImageUrl: imageUrl || "",
				serves: recipeInfo.serves,
				materials: recipeInfo.materials,
				procedures: recipeInfo.procedures,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
		} else {
			console.log("updated");
			const docRef = doc(db, "recipes", recipeInfo.recipeId);
			await updateDoc(docRef, {
				isPublic: recipeInfo.isPublic,
				recipeName: recipeInfo.recipeName,
				comment: recipeInfo.comment,
				recipeImageUrl: imageUrl || "",
				serves: recipeInfo.serves,
				materials: recipeInfo.materials,
				procedures: recipeInfo.procedures,
				updatedAt: serverTimestamp(),
			});
		}

		naviate("/");
	};

	const uploadImage = async (fileUrl: string) => {
		try {
			const response = await fetch(fileUrl);

			if (!response.ok) {
				throw new Error("Failed to fetch image blob");
			}
			const fileBlob = await response.blob();
			const timeStamp = new Date().getTime();
			const uniqueFilename = `${timeStamp}_recipe_image`;
			const storageRef = ref(storage, uniqueFilename);

			await uploadBytes(storageRef, fileBlob);

			const fireBaseStorageUrl = await getDownloadURL(storageRef);

			return fireBaseStorageUrl;
		} catch (error) {
			console.error("Error uploading file", error);
		}
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
					<button
						onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
							uploadRecipeToFirestore(e)
						}
					>
						確定
					</button>
				</div>
			</div>
		</div>
	);
};

export default Confirm;
