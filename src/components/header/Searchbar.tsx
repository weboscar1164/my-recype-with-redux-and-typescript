import SearchIcon from "@mui/icons-material/Search";
import "./Searchbar.scss";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Searchbar = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchWord = searchParams.get("search") ?? "";
	const [inputValue, setInputvalue] = useState<string>(searchWord);

	useEffect(() => {
		setInputvalue(searchWord);
	}, [searchWord]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);
				params.set("search", inputValue);
				params.set("page", "1");
				return params;
			});
		}, 300);
		return () => clearTimeout(timer);
	}, [inputValue]);

	return (
		<div className="searchbar">
			<form>
				<input
					type="text"
					id="searchInput"
					name="searchInput"
					placeholder="レシピを検索"
					value={inputValue}
					onChange={(e) => setInputvalue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setInputvalue("");
						}
					}}
				/>
				<button className="searchbarIcon">
					<SearchIcon />
				</button>
			</form>
		</div>
	);
};

export default Searchbar;
