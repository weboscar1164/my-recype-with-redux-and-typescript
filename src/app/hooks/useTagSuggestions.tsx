import { useEffect, useState } from "react";
import { Suggestion } from "../../Types";
import {
	addDoc,
	collection,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { setLoading } from "../../features/pageStatusSlice";

// LocalStorageのキー定数
const TAG_HISTORY_KEY = "tagHistory";

export const usetagSuggestions = () => {
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

	useEffect(() => {
		const initializeSuggestions = async () => {
			const local = loadLocalHistry();
			const server = await fetchServerSuggestions();
			const fixed = getFixedSuggestions();
			const combined = [...local, ...server, ...fixed];

			// wordの重複を削除
			const uniqueMap = new Map<string, Suggestion>();
			for (const sug of combined) {
				if (!uniqueMap.has(sug.word)) {
					uniqueMap.set(sug.word, sug);
				}
			}
			console.log("uniqueMap:", uniqueMap);
			setSuggestions(Array.from(uniqueMap.values()));
		};
		initializeSuggestions();
	}, []);

	// タグ保存（ローカル + firebase）
	const addTagSuggestions = async (tags: string[]) => {
		saveTagToLocalHistry(tags);
		await addTagSuggestionsToFirebase(tags);
	};

	return {
		suggestions,
		addTagSuggestions,
	};
};

const loadLocalHistry = (): Suggestion[] => {
	const stored = localStorage.getItem(TAG_HISTORY_KEY);
	if (!stored) return [];
	try {
		const parsed: string[] = JSON.parse(stored);
		return parsed.map((word: string) => ({
			word,
			source: "local",
		}));
	} catch (error) {
		console.error("ローカルタグ履歴の読み込みに失敗しました: ", error);
		return [];
	}
};

const saveTagToLocalHistry = (tags: string[]) => {
	const stored = localStorage.getItem(TAG_HISTORY_KEY);
	const histry = stored ? JSON.parse(stored) : [];
	const updated = Array.from(new Set([...histry, ...tags])).slice(-20);

	localStorage.setItem(TAG_HISTORY_KEY, JSON.stringify(updated));
};

// 固定ワード(初期サジェスト)
const getFixedSuggestions = (): Suggestion[] => [
	{ word: "米", source: "fixed" },
	{ word: "主菜", source: "fixed" },
	{ word: "鶏肉", source: "fixed" },
	{ word: "豚肉", source: "fixed" },
];

// サーバー取得 (仮実装)
const fetchServerSuggestions = async (): Promise<Suggestion[]> => {
	try {
		const q = query(collection(db, "tagSuggestions"), orderBy("count", "desc"));
		const querySnapshot = await getDocs(q);
		const results: Suggestion[] = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...(doc.data() as Omit<Suggestion, "id">),
		}));
		return results;
	} catch (error) {
		console.error("タグ候補の取得に失敗しました: ", error);
		return [];
	} finally {
		setLoading(false);
	}
};

// firebaseに保存
const addTagSuggestionsToFirebase = async (tags: string[]) => {
	const tagSuggestionsRef = collection(db, "tagSuggestions");

	for (const tag of tags) {
		const trimmedTag = tag.trim();
		if (!trimmedTag) continue; //空文字対策

		// 同じワードが存在するかチェック
		const q = query(tagSuggestionsRef, where("word", "==", trimmedTag));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			// 存在する場合 → count +1
			const tagDoc = querySnapshot.docs[0];
			await updateDoc(tagDoc.ref, {
				count: (tagDoc.data().count || 0) + 1,
			});
		} else {
			// 存在しない場合
			await addDoc(tagSuggestionsRef, {
				word: trimmedTag,
				count: 1,
			});
		}
	}
};
