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
import ProfilePage from "../dashboard/Profile/ProfilePage";
// import PrivateRoute from "./PrivateRouter";
import POS from "../dashboard/pos/POS";
import ProductsList from "../dashboard/pos/ProductsList";
import ProductDetailsPage from "../dashboard/pos/ProductDetailsPage";
import PosTerminalPage from "../dashboard/pos/PosTerminalPage";
import SalesInvoicePage from "../dashboard/pos/SalesInvoicePage";
import DailySalesPage from "../dashboard/pos/DailySalesPage";
import SalesHistoryPage from "../dashboard/pos/SalesHistoryPage";
import SalesReturnPage from "../dashboard/pos/SalesReturnPage";

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
        path: "products",
        element: <ProductsList />,
      },
      {
        path: "pos",
        element: <PosTerminalPage />,
      },
      {
        path: "pos/invoice",
        element: <SalesInvoicePage />,
      },
      {
        path: "sales/daily",
        element: <DailySalesPage />,
      },
      {
        path: "sales/history",
        element: <SalesHistoryPage />,
      },
      {
        path: "sales/return",
        element: <SalesReturnPage />,
      },
      {
        path: "products/add-product",
        element: <POS />,
      },
      {
        path: "products/product-details/:id",
        element: <ProductDetailsPage />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "admins",
        element: <AdminManage />,
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
