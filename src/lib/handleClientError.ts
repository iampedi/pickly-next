// lib/handleClientError.ts
import axios from "axios";
import { toast } from "sonner";

export function handleClientError(
  error: unknown,
  fallbackMessage = "Something went wrong.",
) {
  let errorMessage = fallbackMessage;

  if (axios.isAxiosError(error)) {
    errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      fallbackMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast.error(errorMessage);
}
