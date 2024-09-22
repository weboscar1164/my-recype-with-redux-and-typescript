import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks/hooks";
import { User } from "../Types";

interface ProtectedRouteProps {
	children: React.ReactNode;
	condition: "isAuthenticated" | "isAdmin";
}

const checkCondition = (
	condition: "isAuthenticated" | "isAdmin",
	user: User | null,
	isAdmin: boolean
): boolean => {
	switch (condition) {
		case "isAuthenticated":
			return !!user;
		case "isAdmin":
			return !!user && isAdmin;
		default:
			return false;
	}
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	condition,
}) => {
	const user = useAppSelector((state) => state.user.user);
	const isAdmin = useAppSelector((state) => state.user.isAdmin);

	const conditionMet = checkCondition(condition, user, isAdmin);

	if (!conditionMet) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
