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
import {
	useAddAdminAndIgnore,
	useAppSelector,
	useDeleteAdminAndIgnore,
	useFetchAdminsAndIgnores,
} from "../../../app/hooks/hooks";

const UserManagement: React.FC = () => {
	const { fetchUsers } = useFetchUsers();
	const [users, setUsers] = useState<User[]>([]);
	const [adminUIDs, setAdminUIDs] = useState<string[]>([]);
	const [ignoreUIDs, setIgnoreUIDs] = useState<string[]>([]);
	const [animationAdminIcon, setAnimationAdminIcon] = useState<string | null>(
		null
	);
	const [animationIgnoreIcon, setAnimationIgnoreIcon] = useState<string | null>(
		null
	);

	const searchWord = useAppSelector((state) => state.searchWord);
	const currentUser = useAppSelector((state) => state.user.user);
	const { fetchAdminsAndIgnores } = useFetchAdminsAndIgnores();
	const { addAdminAndIgnore } = useAddAdminAndIgnore();
	const { deleteAdminAndIgnore } = useDeleteAdminAndIgnore();

	useEffect(() => {
		const getUsers = async () => {
			const fetcheUusersList = await fetchUsers();
			if (fetcheUusersList) {
				setUsers(fetcheUusersList);
			}

			const fetchedAdminUIDs = await fetchAdminsAndIgnores("admins");
			if (fetchedAdminUIDs) {
				setAdminUIDs(fetchedAdminUIDs);
			}
			const fetchedIgnoreUIDs = await fetchAdminsAndIgnores("ignores");
			if (fetchedIgnoreUIDs) {
				setIgnoreUIDs(fetchedIgnoreUIDs);
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
		const invisibleCurrentUser = user.uid === currentUser!.uid ? false : true;

		return matchesSerch && invisibleCurrentUser;
	});

	const changeUserStatus = (uid: string, action: "admins" | "ignores") => {
		const isUserInList = action === "admins" ? isAdminUser : isIgnoreUser;
		const setUIDs = action === "admins" ? setAdminUIDs : setIgnoreUIDs;
		const currentUIDs = action === "admins" ? adminUIDs : ignoreUIDs;
		const setAnimationIcon =
			action === "admins" ? setAnimationAdminIcon : setAnimationIgnoreIcon;

		const listName = action === "admins" ? "管理者リスト" : "使用制限リスト";
		const actionText = isUserInList(uid) ? "から削除" : "に追加";
		const confirmMessage = `${listName}${actionText}しますか？ `;

		if (window.confirm(confirmMessage)) {
			if (!isUserInList(uid)) {
				addAdminAndIgnore(uid, action);
				setUIDs([...currentUIDs, uid]);
			} else {
				deleteAdminAndIgnore(uid, action);
				setUIDs(currentUIDs.filter((userUID) => userUID !== uid));
			}

			setAnimationIcon(uid);
			setTimeout(() => setAnimationIcon(null), 300);
		}
		// if (action === "admins") {
		// 	if (!isAdminUser(uid)) {
		// 		addAdminAndIgnore(uid, action);
		// 		setAdminUIDs([...adminUIDs, uid]);
		// 	} else {
		// 		deleteAdminAndIgnore(uid, action);
		// 		setAdminUIDs(adminUIDs.filter((adminUID) => adminUID !== uid));
		// 	}
		// 	setAnimationAdminIcon(uid);

		// 	setTimeout(() => setAnimationAdminIcon(null), 300);
		// } else if (action === "ignores") {
		// 	if (!isIgnoreUser(uid)) {
		// 		addAdminAndIgnore(uid, action);
		// 		setIgnoreUIDs([...ignoreUIDs, uid]);
		// 	} else {
		// 		deleteAdminAndIgnore(uid, action);
		// 		setIgnoreUIDs(ignoreUIDs.filter((ignoreUID) => ignoreUID !== uid));
		// 	}
		// 	setAnimationIgnoreIcon(uid);

		// 	setTimeout(() => setAnimationIgnoreIcon(null), 300);
		// }
	};

	const isAdminUser = (uid: string) => {
		return adminUIDs.some((adminUID) => adminUID === uid);
	};

	const isIgnoreUser = (uid: string) => {
		return ignoreUIDs.some((ignoreUID) => ignoreUID === uid);
	};

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
								{isAdminUser(user.uid) && (
									<div className="userListAdmin">admin</div>
								)}
							</div>
							<div className="userListRight">
								<div className="userListUid">{user.uid.substring(0, 10)}</div>
								<div className="userListIcon">
									<Tooltip title="メール送信">
										<EmailIcon />
									</Tooltip>
								</div>
								<div
									className={`userListIcon ${
										animationAdminIcon === user.uid && "animationIcon"
									}`}
									onClick={() => changeUserStatus(user.uid, "admins")}
								>
									{!isAdminUser(user.uid) ? (
										<Tooltip title="管理者リストに追加">
											<PersonAddIcon />
										</Tooltip>
									) : (
										<Tooltip title="管理者リストから削除">
											<PersonRemoveIcon />
										</Tooltip>
									)}
								</div>
								<div
									className={`userListIcon ${
										animationIgnoreIcon === user.uid && "animationIcon"
									}`}
									onClick={() => changeUserStatus(user.uid, "ignores")}
								>
									{!isIgnoreUser(user.uid) ? (
										<Tooltip title="使用制限リストに追加">
											<VisibilityOffIcon />
										</Tooltip>
									) : (
										<Tooltip title="使用制限リストから削除">
											<VisibilityIcon />
										</Tooltip>
									)}
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
