import SearchIcon from "@mui/icons-material/Search";
import "./Searchbar.scss";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks/hooks";
import { setSearchQuery } from "../../features/searchWordSlice";

const Searchbar = () => {
	const [searchWord, setSearchWord] = useState<string>("");
	const dispatch = useAppDispatch();

	const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(setSearchQuery(searchWord));
	};
	return (
		<div className="searchbar">
			<form onSubmit={handleSearchClick}>
				<input
					type="text"
					id="searchInput"
					name="searchInput"
					placeholder="レシピを検索"
					value={searchWord}
					onChange={(e) => setSearchWord(e.target.value)}
				/>
				<button className="searchbarIcon">
					<SearchIcon />
				</button>
			</form>
		</div>
	);
};

export default Searchbar;
