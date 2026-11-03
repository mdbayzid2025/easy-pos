import { toast } from "sonner";

export interface CustomErrorResponse {
  data?: {
    success?: boolean;
    message?: string;
    errorMessages?: Array<{ path: string | number; message: string }>;
  };
  message?: string;
  status?: number | string;
}

/**
 * Reusable error handler for API responses and catch blocks.
 * Handles RTK Query error objects, standard backend response objects, and fallback messages.
 * 
 * Expected backend error response shape:
 * {
 *   "success": false,
 *   "message": "Username is invalid"
 * }
 */
export const handleApiError = (
  error: CustomErrorResponse | any,
  fallbackMessage: string = "Something went wrong! Please try again."
): void => {
  console.error("API Error:", error);

  const errorMessage =
    error?.data?.message ||
    error?.message ||
    (typeof error === "string" ? error : null) ||
    fallbackMessage;

  toast.error(errorMessage);
};
