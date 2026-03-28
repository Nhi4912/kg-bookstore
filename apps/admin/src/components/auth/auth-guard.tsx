import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/use-auth";

/**
 * Wraps authenticated routes. Redirects to login if not authenticated.
 * Preserves the attempted URL so we can redirect back after login.
 */
export const RequireAuth = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
	}

	return <Outlet />;
};

/**
 * Wraps public-only routes (login, signup). Redirects to dashboard if already authenticated.
 */
export const GuestOnly = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to={ROUTES.PRODUCTS} replace />;
	}

	return <Outlet />;
};
