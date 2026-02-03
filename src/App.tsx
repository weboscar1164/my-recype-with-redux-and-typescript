import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.scss";
import Header from "./components/header/Header";
import Recipe from "./components/contents/Recipe";
import RecipeList from "./components/contents/RecipeList";
import Navbar from "./components/Sidebar/Navbar";
import EditRecipe from "./components/contents/EditRecipe";
import Confirm from "./components/contents/Confirm";
import Error from "./components/Error";
import { login, logout } from "./features/userSlice";
import { auth, db } from "./firebase";
import {
	useAppDispatch,
	useAppSelector,
	useFetchFavorites,
} from "./app/hooks/hooks";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/contents/admin/AdminPanel";
import { doc, getDoc } from "firebase/firestore";
import { setError } from "./features/pageStatusSlice";
import ConfirmModal from "./components/ConfirmModal";
import Popup from "./components/Popup";
import { useWakeLock } from "./app/hooks/useWakeLock";
import Forbidden from "./components/Forbidden";
import AboutAuth from "./components/AboutAuth";

function App() {
	const dispatch = useAppDispatch();

	const [isIgnore, setIsIgnore] = useState(false);

	const { fetchFavorites } = useFetchFavorites();

	const isLoading = useAppSelector((state) => state.pageStatus.isLoading);
	const error = useAppSelector((state) => state.pageStatus.error);

	useWakeLock();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (loginUser) => {
			if (loginUser) {
				//firebaseから管理者情報を取得
				const userDoc = await getDoc(doc(db, "users", loginUser.uid));
				const role = userDoc.exists() ? userDoc.data().role : "guest";

				//firebaseからignores取得
				const ignoreDoc = await getDoc(doc(db, "ignores", loginUser.uid));
				if (ignoreDoc.exists()) {
					setIsIgnore(true);
					dispatch(setError("閲覧権限がありません。"));
				} else {
					setIsIgnore(false);
					dispatch(setError(null));
				}
				dispatch(
					login({
						user: {
							uid: loginUser.uid,
							photoURL: loginUser.photoURL,
							email: loginUser.email,
							displayName: loginUser.displayName,
							role,
						},
					}),
				);

				//お気に入りを取得
				await fetchFavorites(loginUser.uid);
			} else {
				dispatch(logout());
			}
		});
		return () => unsubscribe(); // クリーンアップ関数でリスナーを解除
	}, []);

	return (
		<div className="app">
			<Router>
				<Header></Header>
				{!isIgnore && <Navbar></Navbar>}
				<div className="contents">
					{!error ? (
						<Routes>
							<Route
								path="/editrecipe"
								element={
									<ProtectedRoute allow={["user", "admin", "guest"]}>
										<EditRecipe />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/confirm"
								element={
									<ProtectedRoute allow={["user", "admin", "guest"]}>
										<Confirm />
									</ProtectedRoute>
								}
							/>
							<Route path="/Recipe" element={<Recipe />} />
							<Route path="/" element={<RecipeList listMode={""} />} />
							<Route
								path="/favorites"
								element={
									<ProtectedRoute allow={["user", "admin", "guest"]}>
										<RecipeList listMode={"favorites"} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/myRecipe"
								element={
									<ProtectedRoute allow={["user", "admin", "guest"]}>
										<RecipeList listMode={"myRecipe"} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin"
								element={
									<ProtectedRoute allow={["admin"]}>
										<AdminPanel />
									</ProtectedRoute>
								}
							/>
							<Route path="/forbidden" element={<Forbidden />} />
							<Route path="about-auth" element={<AboutAuth />} />
						</Routes>
					) : (
						<Error />
					)}
				</div>
				{isLoading && <Loading />}
				<Popup />

				<ConfirmModal />
			</Router>
		</div>
	);
}

export default App;
