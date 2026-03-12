import "./Recipe.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { FavoriteState, MaterialState, InitialRecipeState } from "../../Types";
import {
	useAppSelector,
	useAddFavorite,
	useDeleteFavorite,
	useDeleteFirebaseDocument,
	useAppDispatch,
} from "../../app/hooks/hooks";
import { openModal, resetModal } from "../../features/modalSlice";
import { openPopup } from "../../features/popupSlice";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../Loading";

const Recipe = () => {
	const dispatch = useAppDispatch();

	const [animatingFavIcon, setAnimatingFavIcon] = useState<boolean>(false);
	const [confirmAction, setConfirmAction] = useState<"deleteRecipe" | null>(
		null,
	);

	const [searchParams] = useSearchParams();
	const pageFromUrl = Number(searchParams.get("page")) || 1;

	// URLから所在ページを取得
	const location = useLocation();
	const [currentRecipe, setCurrentRecipe] = useState<InitialRecipeState | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const user = useAppSelector((state) => state.user.user);
	const favorites = useAppSelector((state) => state.favorites);
	const isAdminMode = useAppSelector((state) => state.pageStatus.isAdminMode);

	const navigate = useNavigate();

	const { addFavoriteAsync } = useAddFavorite();
	const { deleteFavoriteAsync } = useDeleteFavorite();
	const { deleteFirebaseDocument } = useDeleteFirebaseDocument();

	const modalState = useAppSelector((state) => state.modal);

	const { id } = useParams();

	// firebaseから詳細データを取得
	useEffect(() => {
		const fetchRecipe = async () => {
			if (!id) return;
			setIsLoading(true);
			try {
				const docRef = doc(db, "recipes", id);
				const metaDataDocRef = doc(
					db,
					"recipes",
					id,
					"metaData",
					"favoriteCount",
				);

				const docSnap = await getDoc(docRef);
				const metaDataDocSnap = await getDoc(metaDataDocRef);

				if (docSnap.exists()) {
					const data = docSnap.data() as InitialRecipeState;
					const favoriteCount = metaDataDocSnap.exists()
						? metaDataDocSnap.data()?.count
						: 0;

					setCurrentRecipe({
						...data,
						recipeId: id,
						favoriteCount,
					});
				} else {
					navigate("/");
				}
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecipe();
	}, [id]);

	// お気に入り制御
	const handleChangeFavorite = async (userId: string, recipeId: string) => {
		if (containsFavorites(favorites, recipeId)) {
			await deleteFavoriteAsync(userId, recipeId);
		} else {
			await addFavoriteAsync(userId, recipeId);
		}
		setAnimatingFavIcon(true);
		setTimeout(() => setAnimatingFavIcon(false), 300);
	};

	// お気に入りの状態を取得
	const containsFavorites = (favorites: FavoriteState[], recipeId: string) => {
		return favorites.some((favorite) => favorite.recipeId === recipeId);
	};

	// レシピ画像がない場合はnoimageを表示
	const getRecipeImage = (recipeImageUrl: string | null) => {
		// console.log(recipeImageUrl);
		return recipeImageUrl ? recipeImageUrl : "/noimage.jpg";
	};

	// グループ記号を取得
	const getGroupIcon = (value: number) => {
		const symbols = ["", "★", "☆", "●", "○", "◎"];
		return symbols[value] || "";
	};

	// 編集画面にジャンプ
	const handleToEditRecipe = () => {
		const targetPath = `/recipes/${currentRecipe?.recipeId}/edit?page=${pageFromUrl}`;
		navigate(targetPath, {
			state: location.state,
		});
	};

	// レシピ削除モーダル表示
	const handleDeleteRecipe = async () => {
		setConfirmAction("deleteRecipe");
		let confirmMessage;
		if (currentRecipe?.user !== user?.uid && user?.role === "admin") {
			confirmMessage = "別のユーザーが作成したレシピです。削除しますか？";
		} else {
			confirmMessage = "削除しますか？";
		}
		dispatch(
			openModal({
				message: confirmMessage,
			}),
		);
	};

	// レシピ削除
	useEffect(() => {
		const deleteRecipe = async () => {
			if (modalState.confirmed !== null && confirmAction === "deleteRecipe") {
				if (modalState.confirmed) {
					if (currentRecipe?.recipeId && currentRecipe.user) {
						try {
							await deleteFirebaseDocument(
								currentRecipe.recipeId,
								currentRecipe.user,
								currentRecipe.recipeImageUrl,
							);
							if (isAdminMode) {
								navigate("/admin");
							} else {
								navigate("/");
							}
							dispatch(
								openPopup({ message: "削除しました。", action: "success" }),
							);
						} catch (error) {
							console.error("レシピ削除時にエラーが発生しました: ", error);
						}
					}
				}
			}
			dispatch(resetModal());
		};
		deleteRecipe();
		setConfirmAction(null);
	}, [modalState.confirmed]);

	const handleBackPage = () => {
		const backPath = location.state?.from || "/recipes";

		navigate(`${backPath}?page=${pageFromUrl}`);
	};

	if (isLoading || !currentRecipe) {
		return <Loading />;
	}

	return (
		<div className="recipe">
			<div className="container recipeContainer">
				<div className="recipeTitle">
					<h2>{currentRecipe.recipeName}</h2>
					{isAdminMode && <div className="recipeTitleAdmin">管理者モード</div>}
				</div>
				<div className="recipeHeader">
					<div className="recipeHeaderAuther">
						by: {currentRecipe.userDisplayName}
					</div>
					{currentRecipe.isPublic == 1 ? (
						<Tooltip title="お気に入り">
							<div
								className="recipeHeaderFav"
								onClick={() =>
									user?.uid
										? currentRecipe.recipeId &&
											currentRecipe.recipeName &&
											handleChangeFavorite(user.uid, currentRecipe.recipeId)
										: alert(
												"お気に入り機能を使用するにはログインしてください。",
											)
								}
							>
								{currentRecipe.recipeId &&
								containsFavorites(favorites, currentRecipe.recipeId) ? (
									<FavoriteIcon
										className={`recipeHeaderFavIcon ${
											animatingFavIcon && "recipeHeaderFavIconAnimation"
										}`}
									/>
								) : (
									<FavoriteBorderIcon
										className={`recipeHeaderFavIcon ${
											animatingFavIcon && "recipeHeaderFavIconAnimation"
										}`}
									/>
								)}

								<span className="recipeHeaderFavCount">
									{currentRecipe.favoriteCount}
								</span>
							</div>
						</Tooltip>
					) : (
						<Tooltip title="公開していません">
							<div className="recipeHeaderPrivate">非公開</div>
						</Tooltip>
					)}
					{(currentRecipe.user === user?.uid || isAdminMode) && (
						<>
							<Tooltip title="編集">
								<div className="recipeHeaderEdit" onClick={handleToEditRecipe}>
									<EditIcon />
								</div>
							</Tooltip>
							<Tooltip title="削除">
								<div
									className="recipeHeaderDelete"
									onClick={handleDeleteRecipe}
								>
									<DeleteIcon />
								</div>
							</Tooltip>
						</>
					)}
				</div>
				{currentRecipe.tags && currentRecipe.tags[0] !== "" ? (
					<div className="recipeTag">
						<ul>
							<ul>
								{currentRecipe.tags &&
									currentRecipe.tags.map((tag, index) => (
										<li key={index}>{tag}</li>
									))}
							</ul>
						</ul>
					</div>
				) : (
					""
				)}
				<p className="recipeImg">
					<img src={getRecipeImage(currentRecipe.recipeImageUrl)} alt="" />
				</p>
				<section className="recipeInfo">
					<h3>Comment</h3>
					<p>
						{currentRecipe.comment
							? currentRecipe.comment
							: "コメントはありません"}
					</p>
				</section>

				<section className="recipeMaterial">
					<h3>材料{currentRecipe.serves}人分</h3>
					<ul>
						{currentRecipe.materials &&
							currentRecipe.materials.map(
								(material: MaterialState, index: number) => (
									<li key={`material-${index}`}>
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
								),
							)}
					</ul>
				</section>

				<section className="recipeProcedure">
					<h3>作り方</h3>
					<ol>
						{currentRecipe.procedures &&
							currentRecipe.procedures.map(
								(procedure: string, index: number) => (
									<li key={index}>{procedure}</li>
								),
							)}
					</ol>
				</section>
				<div className="recipeSubmit">
					<button className="button" onClick={() => handleBackPage()}>
						前のページに戻る
					</button>
				</div>
			</div>
		</div>
	);
};

export default Recipe;
