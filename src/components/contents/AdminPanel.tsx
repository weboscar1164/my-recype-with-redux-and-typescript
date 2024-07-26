import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";

const AdminPanel = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const auth = getAuth();
	const provider = new GoogleAuthProvider();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const idTokenResult = await user.getIdTokenResult();
				setIsAdmin(!!idTokenResult.claims.admin);
			} else {
				setIsAdmin(false);
			}
		});

		return () => unsubscribe();
	}, [auth]);

	const handleLogin = async () => {
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error("Error logging in:", error);
		}
	};

	if (!auth.currentUser) {
		return <button onClick={handleLogin}>Googleでログイン</button>;
	}

	if (!isAdmin) {
		return <div>管理者のみがアクセスできます。</div>;
	}

	return (
		<div>
			<h1>管理者パネル</h1>
		</div>
	);
};

export default AdminPanel;
