import "./AdminPanel.scss";
import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks/hooks";
import { setAdmin } from "../../../features/pageStatusSlice";
import { NavLink, Outlet } from "react-router-dom";

const AdminPanel = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setAdmin(true));
	}, []);

	return (
		<div className="admin">
			<div className="adminContainer">
				<h1>管理者パネル</h1>
				<nav className="adminNav">
					<ul className="adminNavList">
						<li>
							<NavLink
								to="recipes"
								className={({ isActive }) => (isActive ? "adminNavActive" : "")}
							>
								レシピ管理
							</NavLink>
						</li>

						<li>
							<NavLink
								to="users"
								className={({ isActive }) => (isActive ? "adminNavActive" : "")}
							>
								ユーザー管理
							</NavLink>
						</li>
					</ul>
				</nav>
				<div className="admincontent">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminPanel;
