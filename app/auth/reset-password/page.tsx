"use client";

import { resetPasswordAction } from "@/app/actions"
import { FormMessage } from "@/components/form-message"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      className="w-full bg-black text-white hover:bg-gray-800"
      disabled={pending}
    >
      {pending ? "Updating password..." : "Reset Password"}
    </Button>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateForm = (formData: FormData) => {
    let isValid = true;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Reset errors
    setPasswordError("");
    setConfirmPasswordError("");
    setServerError("");
    setSuccessMessage("");

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (validateForm(formData)) {
      const result = await resetPasswordAction(formData);
      if (result.error) {
        setServerError(result.error);
      } else if (result.success) {
        setSuccessMessage(result.message || "");
        // Clear the form
        (e.target as HTMLFormElement).reset();
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-8">Set New Password</h1>
          <p className="text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <PasswordInput
              name="password"
              placeholder="New password"
              required
              className="w-full"
              error={passwordError}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long and contain at least one uppercase letter, 
              one lowercase letter, and one number.
            </p>
          </div>
          
          <div className="space-y-2">
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              className="w-full"
              error={confirmPasswordError}
            />
          </div>

          <SubmitButton />
          
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 