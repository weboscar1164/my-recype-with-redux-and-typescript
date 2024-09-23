import "./Popup.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAppDispatch, useAppSelector } from "../app/hooks/hooks";
import { useEffect, useState } from "react";
import { closePopup } from "../features/popupSlice";

const Popup = () => {
	const dispatch = useAppDispatch();
	const popupState = useAppSelector((state) => state.popup);

	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (popupState.isOpen) {
			setIsActive(true);
			setTimeout(() => {
				setIsActive(false);
			}, 3000);
			setTimeout(() => {
				dispatch(closePopup());
			}, 3300);
		}
	}, [popupState.isOpen]);

	if (!popupState.isOpen) {
		return null;
	}
	return (
		<div
			className={`popupContent ${
				popupState.action === "success" ? "popupSuccess " : "popupNotice "
			} ${isActive ? "popupActive" : ""}`}
		>
			{popupState.action === "success" ? (
				<CheckCircleOutlineIcon />
			) : (
				<ErrorOutlineIcon />
			)}
			<p>{popupState.message}</p>
		</div>
	);
};

export default Popup;
