import Swal from "sweetalert2";

interface ConfirmDeleteOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
}

export const confirmDelete = async ({
  title = "Are you sure?",
  text = "This action cannot be undone!",
  confirmButtonText = "Yes, delete it",
}: ConfirmDeleteOptions = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626", // red
    cancelButtonColor: "#6b7280",  // gray
    confirmButtonText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  return result.isConfirmed;
};
