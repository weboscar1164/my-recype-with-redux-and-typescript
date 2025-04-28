import { db } from "../../firebase";
import {
	addDoc,
	collection,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

export const useAddTagSuggections = () => {
	const addTagSuggections = async (tags: string[]) => {
		const tagSuggectionsRef = collection(db, "tagSuggections");

		for (const tag of tags) {
			const trimmedTag = tag.trim();
			if (!trimmedTag) continue; //空文字対策

			// 同じワードが存在するかチェック
			const q = query(tagSuggectionsRef, where("word", "==", trimmedTag));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				// 存在する場合 → count +1
				const tagDoc = querySnapshot.docs[0];
				await updateDoc(tagDoc.ref, {
					count: (tagDoc.data().count || 0) + 1,
				});
			} else {
				// 存在しない場合
				await addDoc(tagSuggectionsRef, {
					word: trimmedTag,
					count: 1,
				});
			}
		}
	};
	return { addTagSuggections };
};
