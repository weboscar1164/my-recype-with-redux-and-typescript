import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import "./Searchbar.scss";
import { useEffect, useRef, useState } from "react";
import {
	matchPath,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";

const Searchbar = () => {
	const [searchParams] = useSearchParams();
	const searchWord = searchParams.get("search") ?? "";
	const [inputValue, setInputValue] = useState<string>(searchWord);
	const prevKeywordRef = useRef("");
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		setInputValue(searchWord);
	}, [searchWord]);

	useEffect(() => {
		const keyword = inputValue.trim();
		const prevKeyword = prevKeywordRef.current;

		const timer = setTimeout(() => {
			const path = location.pathname;
			const isDetailPage = Boolean(
				matchPath("/recipes/:id", path) ||
				matchPath("/recipes/mine/:id", path) ||
				matchPath("/recipes/favorites/:id", path) ||
				matchPath("admin/recipes/:id", path),
			);

			// ===== 検索解除判定 =====
			const isCleared = prevKeyword && !keyword;

			// 初期状態（空→空）は無視
			console.log(keyword, isCleared);
			if (!keyword && !isCleared) return;

			// ===== 詳細ページ =====
			if (isDetailPage) {
				const params = new URLSearchParams();

				if (keyword) {
					params.set("search", keyword);
					params.set("page", "1");
				}

				const base = location.state?.fromList || "/recipes";

				const targetUrl = params.toString()
					? `${base}?${params}`
					: location.state.fromList;

				navigate(targetUrl);
				return;
			}
			// ===== 一覧ページ =====
			const params = new URLSearchParams(location.search);
			if (keyword) {
				params.set("search", keyword);
				params.set("page", "1");
			} else {
				params.delete("search");
				params.delete("page");
			}

			// 空文字列にならないよう処理
			const query = params.toString();
			const targetUrl = query
				? `${location.pathname}?${query}`
				: location.pathname;

			navigate(targetUrl, { replace: true });
		}, 300);

		prevKeywordRef.current = keyword;

		return () => clearTimeout(timer);
	}, [inputValue, location.pathname]);

	return (
		<div className="searchbar">
			<input
				type="text"
				id="searchInput"
				name="searchInput"
				placeholder="レシピを検索"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						setInputValue("");
					}
				}}
			/>
			{inputValue ? (
				<button className="searchbarIcon" onClick={() => setInputValue("")}>
					<ClearIcon />
				</button>
			) : (
				<SearchIcon className="searchbarIcon" />
			)}
		</div>
	);
};

export default Searchbar;
