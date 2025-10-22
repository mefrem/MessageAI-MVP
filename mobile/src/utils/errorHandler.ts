export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

const errorMap: Record<string, string> = {
  // Auth errors
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/email-already-in-use": "An account with this email already exists",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/invalid-email": "Invalid email address",
  "auth/user-disabled": "This account has been disabled",
  "auth/network-request-failed": "Network error. Please check your connection",

  // Firestore errors
  "permission-denied": "You do not have permission to perform this action",
  "not-found": "The requested resource was not found",
  "already-exists": "The resource already exists",
  unavailable: "Service temporarily unavailable. Please try again",
  unauthenticated: "Please sign in to continue",

  // Storage errors
  "storage/unauthorized": "You do not have permission to access this file",
  "storage/canceled": "Upload was canceled",
  "storage/unknown": "An unknown error occurred during upload",
};

export const handleFirebaseError = (error: any): AppError => {
  const code = error?.code || "unknown";
  const message =
    errorMap[code] || error?.message || "An unexpected error occurred";

  return {
    code,
    message,
    details: error?.details,
    timestamp: new Date(),
  };
};

export const showError = (
  error: AppError | Error | any,
  showToast?: (message: string) => void
) => {
  const appError = error?.code ? error : handleFirebaseError(error);

  console.error("[Error]", appError);

  if (showToast) {
    showToast(appError.message);
  }

  return appError;
};

