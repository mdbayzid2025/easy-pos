import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Shared/ErrorPage";
import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";
import NewPassword from "../auth/NewPassword";
import OTPVerifyPage from "../auth/OTPVerifyPage";
import AdminManage from "../dashboard/Admin/Admins";
import Dashboard from "../dashboard/Dashboard/Dashboard";
import Notificatiion from "../dashboard/Notification/Notification";
import StaffManagement from "../dashboard/Staff/StaffManagement";
import BuildingManagement from "../dashboard/Building/BuildingManagement";
import BuildingDetailsPage from "../dashboard/Building/BuildingDetailsPage";
import ReportsManagement from "../dashboard/Reports/ReportsManagement";
import TenantManagement from "../dashboard/Tenant/TenantManagement";
import TenantDetailsPage from "../dashboard/Tenant/TenantDetailsPage";
import IncomeManagement from "../dashboard/Income/IncomeManagement";
import ExpenseManagement from "../dashboard/Expense/ExpenseManagement";
import ExpenseCategoryManagement from "../dashboard/ExpenseCategory/ExpenseCategoryManagement";
import UtilityManagement from "../dashboard/Utility/UtilityManagement";
import ProfilePage from "../dashboard/Profile/ProfilePage";
import PrivateRoute from "./PrivateRouter";
import POS from "../dashboard/pos/POS";

const router = createBrowserRouter([
  {
    path: "/",
    // element: (
    //   <PrivateRoute>
    //     <MainLayout />
    //   </PrivateRoute>
    // ),
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "pos",
        element: <POS />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "buildings",
        element: <BuildingManagement />,
      },

      {
        path: "buildings/:id",
        element: <BuildingDetailsPage />,
      },

      {
        path: "tenants",
        element: <TenantManagement />,
      },
      {
        path: "tenants/:id",
        element: <TenantDetailsPage />,
      },

      {
        path: "income",
        element: <IncomeManagement />,
      },

      {
        path: "utilities",
        element: <UtilityManagement />,
      },

      {
        path: "expenses",
        element: <ExpenseManagement />,
      },

      {
        path: "expense-categories",
        element: <ExpenseCategoryManagement />,
      },

      {
        path: "reports",
        element: <ReportsManagement />,
      },

      {
        path: "admins",
        element: <AdminManage />,
      },
      {
        path: "Sidebar",
        element: <StaffManagement />,
      },

      {
        path: "notification",
        element: <Notificatiion />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/otp-verify", element: <OTPVerifyPage /> },
  { path: "/new-password", element: <NewPassword /> },
]);

export default router;
