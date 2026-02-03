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
	console.log("user.role: ", user?.role);

	if (!user) {
		return <Navigate to="/forbidden?reason=login" replace />;
	}

	if (user.role === "guest" && !allow.includes("guest")) {
		return <Navigate to="/forbidden?reason=verify" replace />;
	}

	if (!allow.includes(user.role)) {
		return <Navigate to="/forbidden?reason=role" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
