import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Navbar.scss";

const Navbar = () => {
	return (
		<div className="navbar">
			<ArrowForwardIosIcon className="navToggleIcon" />
			<nav className="navList">
				<ul>
					<li>一覧</li>
					<li>投稿</li>
					<li>お気に入り</li>
					<li>ログイン</li>
					<li>ログアウト</li>
					<li>新規登録</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
