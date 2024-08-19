import React, { useEffect, useState } from "react";
import { useFetchUsers } from "../../../app/hooks/useFetchUsers";
import { User } from "../../../Types";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";

import "./UserManagement.scss";
import { useAppSelector } from "../../../app/hooks/hooks";

const UserManagement: React.FC = () => {
	const { fetchUsers } = useFetchUsers();
	const [users, setUsers] = useState<User[]>([]);
	const searchWord = useAppSelector((state) => state.searchWord);
	const currentUser = useAppSelector((state) => state.user.user);

	useEffect(() => {
		const getUsers = async () => {
			const usersList = await fetchUsers();
			console.log(usersList);
			if (usersList) {
				setUsers(usersList);
			}
		};

		getUsers();
	}, []);

	// 表示するリストのソート
	const sortedUsers = users.filter((user) => {
		// 検索語句との一致
		const matchesSerch = searchWord
			? user.displayName.toLowerCase().includes(searchWord.toLowerCase())
			: true;
		//　ログインしているユーザーは表示しない
		const invisibleCurrentUser = user.uid === currentUser.uid ? false : true;

		return matchesSerch && invisibleCurrentUser;
	});

	return (
		<div className="userList">
			<div className="userListContainer">
				<div className="userManagementHeader">
					<h3>{searchWord && `検索結果: ${searchWord}`}</h3>
				</div>
				<ul>
					{sortedUsers.map((user) => (
						<li id={user.uid} key={user.uid}>
							<div className="userListLeft">
								<div className="userListImg">
									<img src={user.photoURL} alt="" />
								</div>
								<h3 className="userListDisplayName">{user.displayName}</h3>
							</div>
							<div className="userListRight">
								<div className="userListUid">{user.uid.substring(0, 10)}</div>
								<div className="userListIcon">
									<Tooltip title="メール送信">
										<EmailIcon />
									</Tooltip>
								</div>
								<div className="userListIcon">
									<Tooltip title="管理者に指定">
										<PersonAddIcon />
									</Tooltip>
								</div>
								<div className="userListIcon">
									<Tooltip title="使用権限を無効にする">
										<VisibilityOffIcon />
									</Tooltip>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default UserManagement;
