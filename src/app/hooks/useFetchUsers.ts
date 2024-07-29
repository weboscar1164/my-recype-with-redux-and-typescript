import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch } from "./hooks";
import { User } from "../../Types";
import { setError, setLoading } from "../../features/loadingSlice";
import { getAuth } from "firebase/auth";

export const useFetchUsers = () => {
	const dispatch = useAppDispatch();

	const fetchUserDetails = async (uid: string) => {
		const auth = getAuth();
		const userRecord = await getUser(auth, uid);
	};

	const fetchUsers = async () => {
		dispatch(setLoading(true));
		try {
			const querySnapshot = await getDocs(collection(db, "users"));
			const usersList: User[] = [];
			querySnapshot.forEach((doc) => {
				usersList.push({
					uid: doc.id,
					photo: doc.id,
					email: doc.id,
					displayName: doc.id,
					...doc.data(),
				} as User);
			});

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
