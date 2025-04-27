import { useEffect, useState } from "react";
import { Suggestion } from "../../Types";

export const usetagSuggestions = () => {
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

	useEffect(() => {
		const initializeSuggestions = async () => {
			const local = loadLocalHistry();
			const fixed = getFixedSuggestions();
			const server = await fetchServerSuggestions();
			setSuggestions([...local, ...fixed, ...server]);
		};
		initializeSuggestions();
	}, []);

	const addTag = async (tag: string) => {
		saveTagToLocalHistry(tag);
		await sendTagToServer(tag);
	};

	return {
		suggestions,
		addTag,
	};
};
const loadLocalHistry = (): Suggestion[] => {
	const stored = localStorage.getItem("tagHistory");
	if (!stored) return [];
	return JSON.parse(stored).map((word: string) => ({
		word,
		source: "local",
	}));
};

const saveTagToLocalHistry = (tag: string) => {
	const stored = localStorage.getItem("tagHistry");
	const histry = stored ? JSON.parse(stored) : [];
	const newHistry = [...histry, tag].slice(-20);
	localStorage.setItem("tagHistory", JSON.stringify(newHistry));
};
const getFixedSuggestions = (): Suggestion[] => [
	{ word: "米", source: "fixed" },
	{ word: "主菜", source: "fixed" },
	{ word: "鶏肉", source: "fixed" },
	{ word: "豚肉", source: "fixed" },
];

// サーバー取得 (仮実装)
const fetchServerSuggestions = async (): Promise<Suggestion[]> => {
	// TODO: Firebaseとかから取る
	return [
		{ word: "パン", source: "server" },
		{ word: "副菜", source: "server" },
	];
};

// サーバー送信 (仮実装)
const sendTagToServer = async (tag: string) => {
	console.log("送信: ", tag);
	// TODO: Firebaseにタグを追加する処理を書く
};
