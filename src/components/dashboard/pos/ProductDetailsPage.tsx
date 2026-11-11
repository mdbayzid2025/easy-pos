import React from "react";
import { Navigate, useParams } from "react-router-dom";

// Details are now displayed directly via the interactive ProductDetailsModal inside ProductsList.
// If accessed directly by URL, redirect gracefully to /products.
export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to="/products" replace state={{ openDetailsId: id }} />;
};

export default ProductDetailsPage;
