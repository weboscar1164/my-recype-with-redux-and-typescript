import "./AdminPanel.scss";
import { useState } from "react";
import UserManagement from "./UserManagement";
import RecipeManagement from "./RecipeManagement";

const AdminPanel = () => {
	const [selectedSection, setSelectedSection] =
		useState<string>("userManagement");
	const renderSection = () => {
		switch (selectedSection) {
			case "userManagement":
				return <UserManagement />;
			case "recipeManagement":
				return <RecipeManagement />;
			default:
				return <div>選択されたセクションはありません。</div>;
		}
	};

	return (
		<div className="admin">
			<div className="adminContainer">
				<h1>管理者パネル</h1>
				<nav className="adminNav">
					<ul className="adminNavList">
						<li
							className={
								selectedSection && selectedSection === "userManagement"
									? "adminNavActive"
									: ""
							}
							onClick={() => setSelectedSection("userManagement")}
						>
							ユーザー管理
						</li>
						<li
							className={
								selectedSection && selectedSection === "recipeManagement"
									? "adminNavActive"
									: ""
							}
							onClick={() => setSelectedSection("recipeManagement")}
						>
							レシピ管理
						</li>
					</ul>
				</nav>
				<div className="admincontent">{renderSection()}</div>
			</div>
		</div>
	);
};

export default AdminPanel;
