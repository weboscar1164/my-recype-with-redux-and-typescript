import Searchbar from "./Searchbar";
import "./Header.scss";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
	return (
		<div className="header">
			<h1>My Recipe</h1>
			<Searchbar />
			<div className="userInfo">
				<div className="userIcon">
					<img src="vite.svg" alt="" />
				</div>
				<div className="userName">user01</div>
				<LogoutIcon />
			</div>
		</div>
	);
};

export default Header;
