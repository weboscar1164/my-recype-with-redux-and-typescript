import React, { useEffect, useState } from "react";
import {
	useFetchUsers,
	useIgnoreUser,
	usePagination,
} from "../../../app/hooks/hooks";
import { Role, User } from "../../../Types";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { MenuItem, Select, Tooltip } from "@mui/material";

import "./UserManagement.scss";
import {
	useAppSelector,
	useFetchAdminsAndIgnores,
	useChangeUserRole,
} from "../../../app/hooks/hooks";
import { useDispatch } from "react-redux";
import { openModal, resetModal } from "../../../features/modalSlice";
import Pagination from "../../Pagination";
import { openPopup } from "../../../features/popupSlice";

const UserManagement: React.FC = () => {
	const { fetchUsers } = useFetchUsers();
	const { fetchAdminsAndIgnores } = useFetchAdminsAndIgnores();
	const { addIgnores, removeIgnores } = useIgnoreUser();

	const dispatch = useDispatch();

	const [users, setUsers] = useState<User[]>([]);
	const [ignoreUIDs, setIgnoreUIDs] = useState<string[]>([]);
	const [selectedUID, setSelectedUID] = useState<string>("");
	const [newUserRole, setNewUserRole] = useState<Role | null>(null);
	const [confirmAction, setConfirmAction] = useState<
		"setRole" | "ignore" | null
	>(null);

	const [animationIcon, setAnimationIcon] = useState<string | null>(null);

	const searchWord = useAppSelector((state) => state.searchWord);
	const currentUser = useAppSelector((state) => state.user.user);
	const modalState = useAppSelector((state) => state.modal);
	const itemsPerPage = 10;

	const { changeUserRole } = useChangeUserRole();

	const rolabelMap: Record<Role, string> = {
		admin: "管理者",
		user: "ユーザー",
		guest: "ゲスト",
	};

	useEffect(() => {
		const getUsers = async () => {
			const fetcheUsersList = await fetchUsers();
			if (fetcheUsersList) {
				setUsers(fetcheUsersList);
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

	useEffect(() => {
		if (modalState.confirmed !== true) return;
		if (!confirmAction) return;
		switch (confirmAction) {
			case "setRole":
				if (!selectedUID || !newUserRole) return;
				changeUserRole(selectedUID, newUserRole);
				dispatch(
					openPopup({
						message: `ステータスを ${rolabelMap[newUserRole]} に変更しました。`,
						action: "success",
					})
				);
				setUsers((prev) =>
					prev.map((user) =>
						user.uid === selectedUID ? { ...user, role: newUserRole } : user
					)
				);
				setSelectedUID("");
				setNewUserRole(null);
				setConfirmAction(null);
				break;
			case "ignore":
				if (isIgnoreUser(selectedUID)) {
					removeIgnores(selectedUID);
					setIgnoreUIDs(
						ignoreUIDs.filter((userUID) => userUID !== selectedUID)
					);
					dispatch(
						openPopup({
							message: "使用制限リストから削除しました。",
							action: "success",
						})
					);
				} else {
					addIgnores(selectedUID);
					setIgnoreUIDs([...ignoreUIDs, selectedUID]);
					dispatch(
						openPopup({
							message: "使用制限リストに追加しました。",
							action: "success",
						})
					);
				}
				setAnimationIcon(selectedUID);
				setTimeout(() => setAnimationIcon(null), 300);

				setSelectedUID("");
				setNewUserRole(null);
				setConfirmAction(null);
				break;
		}

		dispatch(resetModal());
	}, [modalState.confirmed]);

	const isIgnoreUser = (uid: string) => {
		return ignoreUIDs.some((ignoreUID) => ignoreUID === uid);
	};

	const confirmUserRole = (uid: string, role: Role) => {
		console.log(uid, role);

		setConfirmAction("setRole");
		setSelectedUID(uid);
		setNewUserRole(role);
		dispatch(
			openModal({ message: `ステータスを${rolabelMap[role]}に変更しますか？` })
		);
	};

	const confirmUserIgnore = (uid: string) => {
		setSelectedUID(uid);
		setConfirmAction("ignore");
		const modalMessage = ignoreUIDs.includes(uid)
			? "使用制限リストから削除しますか？"
			: "使用制限リストに追加しますか？";
		dispatch(openModal({ message: modalMessage }));
	};

	//paginationフックを用いてページネーション用変数を準備
	const {
		currentItems: currentItems,
		totalPages,
		currentPage,
		handlePageChange,
	} = usePagination(sortedUsers, itemsPerPage);

	return (
		<div className="userList">
			<div className="userListContainer">
				<div className="userManagementHeader">
					<h3>{searchWord && `検索結果: ${searchWord}`}</h3>
				</div>
				<ul>
					{currentItems.map((user) => (
						<li id={user.uid} key={user.uid}>
							<div className="userListLeft">
								<div className="userListImg">
									<img src={user.photoURL} alt="" />
								</div>
								<h3 className="userListDisplayName">{user.displayName}</h3>
								{user.role === "admin" && (
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
								<div>
									<Select
										size="small"
										value={user.role}
										onChange={(e) =>
											confirmUserRole(user.uid, e.target.value as Role)
										}
									>
										<MenuItem value="guest">ゲスト</MenuItem>
										<MenuItem value="user">ユーザー</MenuItem>
										<MenuItem value="admin">管理者</MenuItem>
									</Select>
								</div>
								<div
									className={`userListIcon ${
										animationIcon === user.uid && "animationIcon"
									}`}
									onClick={() => confirmUserIgnore(user.uid)}
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
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
};

export default UserManagement;
