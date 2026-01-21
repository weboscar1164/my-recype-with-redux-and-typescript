import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks/hooks";
import { Role } from "../Types";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allow: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allow }) => {
	const user = useAppSelector((state) => state.user.user);

	// 未ログイン　→ guest扱い
	const role: Role = user?.role ?? "guest";

	if (!allow.includes(role)) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
