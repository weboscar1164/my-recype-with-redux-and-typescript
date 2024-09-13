import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { cancelModal, confirmModal } from "../features/modalSlice";
import "./ConfirmModal.scss";
import { useAppSelector } from "../app/hooks/hooks";

const ConfirmModal = () => {
	const modalState = useAppSelector((state) => state.modal);

	const dispatch = useDispatch();

	if (!modalState.isOpen) {
		return null;
	}

	const handleConfirm = () => {
		dispatch(confirmModal());
	};

	const handleCancel = () => {
		dispatch(cancelModal());
	};
	return (
		<div className="modalOverlay">
			<div className="modalContent">
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
