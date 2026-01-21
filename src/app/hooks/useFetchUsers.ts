import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { User } from "../../Types";
import { setError, setLoading } from "../../features/pageStatusSlice";

export const useFetchUsers = () => {
	const dispatch = useAppDispatch();

	const fetchUsers = async () => {
		dispatch(setLoading(true));
		const usersList: User[] = [];
		try {
			const userSnapshot = await getDocs(collection(db, "users"));
			const promises = userSnapshot.docs.map(async (userDoc) => {
				const role = userDoc.data().role ?? "guest";

				const userInfoRef = collection(db, "users", userDoc.id, "userInfo");
				const userInfoSnapshot = await getDocs(userInfoRef);

				userInfoSnapshot.forEach((doc) => {
					usersList.push({
						uid: doc.id,
						photoURL: doc.data().photoURL,
						email: doc.data().email,
						displayName: doc.data().displayName,
						role,
					} as User);
				});
			});
			await Promise.all(promises);

			// console.log(usersList);
			return usersList;
		} catch (error) {
			dispatch(
				setError(`ユーザー一覧取得時にエラーが発生しました。: ${error}`)
			);
			console.error("Error fetching users: ", error);
		} finally {
			dispatch(setLoading(false));
		}
	};

	return { fetchUsers };
};
