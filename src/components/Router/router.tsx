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
import StockOverviewPage from "../dashboard/inventory/StockOverviewPage";
import ProductStockOverviewPage from "../dashboard/inventory/ProductStockOverviewPage";
import StockAdjustmentPage from "../dashboard/inventory/StockAdjustmentPage";
import ReceiveStockPage from "../dashboard/inventory/ReceiveStockPage";
import PurchasesListPage from "../dashboard/purchases/PurchasesListPage";
import NewPurchasePage from "../dashboard/purchases/NewPurchasePage";
import PurchaseDetailsPage from "../dashboard/purchases/PurchaseDetailsPage";
import PurchaseReturnPage from "../dashboard/purchases/PurchaseReturnPage";
import SuppliersListPage from "../dashboard/suppliers/SuppliersListPage";
import AddSupplierPage from "../dashboard/suppliers/AddSupplierPage";
import SupplierDetailsPage from "../dashboard/suppliers/SupplierDetailsPage";

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

      // Stock Manage / Inventory Routes
      {
        path: "inventory",
        element: <StockOverviewPage />,
      },
      {
        path: "inventory/stock-overview",
        element: <StockOverviewPage />,
      },
      {
        path: "inventory/stock-overview/:id",
        element: <ProductStockOverviewPage />,
      },
      {
        path: "inventory/stock-adjustment",
        element: <StockAdjustmentPage />,
      },
      {
        path: "inventory/receive-stock",
        element: <ReceiveStockPage />,
      },

      // Stock Manage aliases
      {
        path: "stock-manage",
        element: <StockOverviewPage />,
      },
      {
        path: "stock-manage/stock-overview",
        element: <StockOverviewPage />,
      },
      {
        path: "stock-manage/stock-overview/:id",
        element: <ProductStockOverviewPage />,
      },
      {
        path: "stock-manage/stock-adjustment",
        element: <StockAdjustmentPage />,
      },
      {
        path: "stock-manage/receive-stock",
        element: <ReceiveStockPage />,
      },

      // Purchases Routes
      {
        path: "purchases",
        element: <PurchasesListPage />,
      },
      {
        path: "purchases/new",
        element: <NewPurchasePage />,
      },
      {
        path: "purchases/details/:id",
        element: <PurchaseDetailsPage />,
      },
      {
        path: "purchases/:id",
        element: <PurchaseDetailsPage />,
      },
      {
        path: "purchases/return",
        element: <PurchaseReturnPage />,
      },

      // Suppliers Routes
      {
        path: "suppliers",
        element: <SuppliersListPage />,
      },
      {
        path: "suppliers/new",
        element: <AddSupplierPage />,
      },
      {
        path: "suppliers/details/:id",
        element: <SupplierDetailsPage />,
      },
      {
        path: "suppliers/:id",
        element: <SupplierDetailsPage />,
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
