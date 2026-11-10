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
        element: <ProductsList />,
      },
      {
        path: "pos/add-product",
        element: <POS />,
      },
      {
        path: "pos/product-details/:id",
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
