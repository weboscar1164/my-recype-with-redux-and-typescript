import { useDispatch } from "react-redux";
import { cancelModal, confirmModal } from "../features/modalSlice";
import "./ConfirmModal.scss";
import { useAppSelector } from "../app/hooks/hooks";
import { useEffect, useState } from "react";

const ConfirmModal = () => {
	const modalState = useAppSelector((state) => state.modal);
	const [isActive, setIsActive] = useState<boolean>(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (modalState.isOpen) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [modalState.isOpen]);

	const handleConfirm = () => {
		setIsActive(false);
		setTimeout(() => {
			dispatch(confirmModal());
		}, 300);
	};

	const handleCancel = () => {
		setIsActive(false);
		setTimeout(() => {
			dispatch(cancelModal());
		}, 300);
	};

	if (!modalState.isOpen) {
		return null;
	}
	return (
		<div className={`modalOverlay ${isActive ? "modalOverlayActive" : ""}`}>
			<div className={`modalContent ${isActive ? "modalContentActive" : ""}`}>
				<p>{modalState.message}</p>
				<div className="modalButtons">
					<button onClick={handleConfirm}>OK</button>
					<button onClick={handleCancel}>キャンセル</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
