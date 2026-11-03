import { toast } from "sonner";

/**
 * Reusable error handler for API calls
 */
export const handleApiError = (
  error: any,
  fallbackMessage: string = "কিছু একটা ভুল হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।"
) => {
  console.error("API Error caught:", error);

  let errorMessage = fallbackMessage;

  if (error?.data) {
    if (typeof error.data.message === "string") {
      errorMessage = error.data.message;
    } else if (Array.isArray(error.data.message) && error.data.message.length > 0) {
      errorMessage = error.data.message.join(", ");
    } else if (typeof error.data === "string") {
      errorMessage = error.data;
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  toast.error(errorMessage);
  return errorMessage;
};
