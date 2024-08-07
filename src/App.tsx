import { useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "./app/hooks/hooks";
import { useFavorites } from "./app/hooks/hooks";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/contents/admin/AdminPanel";
import { doc, getDoc } from "firebase/firestore";

function App() {
	const dispatch = useAppDispatch();
	const { fetchFavorites } = useFavorites();

	const isLoading = useAppSelector((state) => state.loading.isLoading);
	const error = useAppSelector((state) => state.loading.error);

	useEffect(() => {
		auth.onAuthStateChanged(async (loginUser) => {
			if (loginUser) {
				//firebaseから管理者情報を取得
				const userDoc = await getDoc(doc(db, "admins", loginUser.uid));
				const isAdmin = userDoc.exists();

				dispatch(
					login({
						user: {
							uid: loginUser.uid,
							photo: loginUser.photoURL,
							email: loginUser.email,
							displayName: loginUser.displayName,
						},
						isAdmin: isAdmin,
					})
				);
				fetchFavorites(loginUser.uid);
			} else {
				dispatch(logout());
			}
		});
	}, [dispatch]);

	return (
		<div className="app">
			<Router>
				<Header></Header>
				<Navbar></Navbar>
				<div className="contents">
					{!error ? (
						<Routes>
							<Route
								path="/editrecipe"
								element={
									<ProtectedRoute condition="isAuthenticated">
										<EditRecipe />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/confirm"
								element={
									<ProtectedRoute condition="isAuthenticated">
										<Confirm />
									</ProtectedRoute>
								}
							/>
							<Route path="/Recipe" element={<Recipe />} />
							<Route
								path="/favorites"
								element={
									<ProtectedRoute condition="isAuthenticated">
										<RecipeList showFavorites={true} />
									</ProtectedRoute>
								}
							/>
							<Route path="/" element={<RecipeList showFavorites={false} />} />
							<Route
								path="/admin"
								element={
									<ProtectedRoute condition="isAdmin">
										<AdminPanel />
									</ProtectedRoute>
								}
							/>
						</Routes>
					) : (
						<Error />
					)}
				</div>
				{isLoading && <Loading />}
			</Router>
		</div>
	);
}

export default App;
