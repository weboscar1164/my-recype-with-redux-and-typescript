import { useAppSelector } from "../app/hooks/hooks";
import "./Error.scss";

const Error = () => {
	const error = useAppSelector((state) => state.loading.error);
	return (
		<div className="error">
			<div className="errorContainer">{error}</div>
		</div>
	);
};

export default Error;
