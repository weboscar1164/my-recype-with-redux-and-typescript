import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks/hooks";

interface ProtectedRouteProps {
	children: React.ReactNode;
	condition: string;
}

const checkCondition = (
	condition: string,
	user: any,
	isAdmin: boolean
): boolean => {
	console.log(user, isAdmin);
	switch (condition) {
		case "isAuthenticated":
			return !!user;
		case "isAdmin":
			return !!isAdmin;
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
