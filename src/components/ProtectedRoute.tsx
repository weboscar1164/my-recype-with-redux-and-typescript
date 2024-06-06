import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks/hooks";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const user = useAppSelector((state) => state.user.user);

	if (!user) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
