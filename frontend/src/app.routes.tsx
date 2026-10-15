import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import DashboardPage from "./features/projects/pages/DashboardPage";
import PublicRoute from "./components/shared/PublicRoute";
import ProjectPage from "./features/projects/pages/ProjectPage";
import PaymentPage from "./features/payment/pages/PaymentPage";

const RootLayout = () => (
    <>
        <Outlet />
    </>
)
export const Router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />
                    },
                    {
                        path: "/project/:projectId",
                        element: <ProjectPage />
                    },
                    {
                        path: "/plans",
                        element: <PaymentPage />
                    }
                ]
            },
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "/login",
                        element: <LoginPage />,
                    },
                    {
                        path: "/register",
                        element: <RegisterPage />,
                    },
                ],
            },
            {
                path: "*",
                element: <div>Page not found</div>
            }
        ]
    }
])