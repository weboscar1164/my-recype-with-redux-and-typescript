import SearchIcon from "@mui/icons-material/Search";
import "./Searchbar.scss";

const Searchbar = () => {
	return (
		<div className="searchbar">
			<input type="text" placeholder="レシピを検索" />
			<SearchIcon className="searchbarIcon" />
		</div>
	);
};

export default Searchbar;
