import React, { useEffect, useState } from "react";
import { useFetchUsers } from "../../../app/hooks/useFetchUsers";
import { User } from "firebase/auth";

const UserManagement: React.FC = () => {
	const { fetchUsers } = useFetchUsers();
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const getUsers = async () => {
			const userList = await fetchUsers();
			if (userList) {
				setUsers(userList);
			}
		};

		getUsers();
	}, []);

	return (
		<div className="recipeList recipeListAdmin">
			<div className="recipeListAdminContainer">
				<ul>
					{users.map((user) => (
						<li id={user.uid}>{user.uid}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default UserManagement;
