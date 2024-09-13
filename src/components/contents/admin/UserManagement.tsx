import React, { useEffect, useState } from "react";
import { useFetchUsers } from "../../../app/hooks/useFetchUsers";
import { User } from "../../../Types";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Tooltip } from "@mui/material";

import "./UserManagement.scss";
import {
	useAddAdminAndIgnore,
	useAppSelector,
	useDeleteAdminAndIgnore,
	useFetchAdminsAndIgnores,
} from "../../../app/hooks/hooks";
import { useDispatch } from "react-redux";
import { openModal, resetModal } from "../../../features/modalSlice";

const UserManagement: React.FC = () => {
	const { fetchUsers } = useFetchUsers();
	const { fetchAdminsAndIgnores } = useFetchAdminsAndIgnores();
	const { addAdminAndIgnore } = useAddAdminAndIgnore();
	const { deleteAdminAndIgnore } = useDeleteAdminAndIgnore();

	const dispatch = useDispatch();

	const [users, setUsers] = useState<User[]>([]);
	const [adminUIDs, setAdminUIDs] = useState<string[]>([]);
	const [ignoreUIDs, setIgnoreUIDs] = useState<string[]>([]);
	const [selectedUID, setSelectedUID] = useState<string>("");

	const [animationIcon, setAnimationIcon] = useState<{
		admins: string | null;
		ignores: string | null;
	}>({ admins: null, ignores: null });

	const searchWord = useAppSelector((state) => state.searchWord);
	const currentUser = useAppSelector((state) => state.user.user);
	const modalState = useAppSelector((state) => state.modal);

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
	const isUserInList = (uid: string, list: string[]) => list.includes(uid);

	const changeUserStatus = (uid: string, action: "admins" | "ignores") => {
		setSelectedUID(uid);

		const isInList = isUserInList(
			uid,
			action === "admins" ? adminUIDs : ignoreUIDs
		);
		const listName = action === "admins" ? "管理者リスト" : "使用制限リスト";
		const actionText = isInList ? "から削除" : "に追加";
		const confirmMessage = `${listName}${actionText}しますか？ `;

		dispatch(openModal({ message: confirmMessage, action }));
	};

	useEffect(() => {
		if (modalState.confirmed !== null && modalState.action) {
			const action = modalState.action;
			const isInList = isUserInList(
				selectedUID,
				action === "admins" ? adminUIDs : ignoreUIDs
			);
			const currentUIDs = action === "admins" ? adminUIDs : ignoreUIDs;
			const setUIDs = action === "admins" ? setAdminUIDs : setIgnoreUIDs;

			if (modalState.confirmed) {
				if (!isInList) {
					addAdminAndIgnore(selectedUID, action);
					setUIDs([...currentUIDs, selectedUID]);
				} else {
					deleteAdminAndIgnore(selectedUID, action);
					setUIDs(currentUIDs.filter((userUID) => userUID !== selectedUID));
				}
				setAnimationIcon((prev) => ({ ...prev, [action]: selectedUID }));
				setTimeout(
					() => setAnimationIcon((prev) => ({ ...prev, [action]: null })),
					300
				);
			}
		}
		dispatch(resetModal());
	}, [modalState.confirmed]);

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
									<div className="userListAdmin">
										<Tooltip title="管理者">
											<LockOpenIcon />
										</Tooltip>
									</div>
								)}
								{isIgnoreUser(user.uid) && (
									<div className="userListIgnore">
										<Tooltip title="使用制限中">
											<ReportProblemIcon />
										</Tooltip>
									</div>
								)}
							</div>
							<div className="userListRight">
								<div className="userListUid">{user.uid.substring(0, 10)}</div>
								<div className="userListIcon">
									<Tooltip title="メール送信">
										<a href={`mailto:${user.email}`}>
											<EmailIcon />
										</a>
									</Tooltip>
								</div>
								<div
									className={`userListIcon ${
										animationIcon.admins === user.uid && "animationIcon"
									}`}
									onClick={() => changeUserStatus(user.uid, "admins")}
								>
									<Tooltip
										title={
											!isAdminUser(user.uid)
												? "管理者リストに追加"
												: "管理者リストから削除"
										}
									>
										{!isAdminUser(user.uid) ? (
											<PersonAddIcon />
										) : (
											<PersonRemoveIcon />
										)}
									</Tooltip>
								</div>
								<div
									className={`userListIcon ${
										animationIcon.ignores === user.uid && "animationIcon"
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
