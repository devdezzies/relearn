"use client";

import { forgotPasswordAction } from "@/app/actions"
import { FormMessage } from "@/components/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      className="w-full bg-black text-white hover:bg-gray-800"
      disabled={pending}
    >
      {pending ? "Sending reset link..." : "Send Reset Link"}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateForm = (formData: FormData) => {
    let isValid = true;
    const email = formData.get("email") as string;

    // Reset errors
    setEmailError("");
    setServerError("");
    setSuccessMessage("");

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (validateForm(formData)) {
      const result = await forgotPasswordAction(formData);
      if (result.error) {
        setServerError(result.error);
      } else if (result.success) {
        setSuccessMessage(result.message || "");
        // Clear the form
        (e.target as HTMLFormElement).reset();
      }
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-8">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full px-3 py-2 border rounded-md"
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p className="text-sm text-red-500" id="email-error">
                {emailError}
              </p>
            )}
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

        <div className="text-center text-sm">
          <span className="text-gray-600">Remember your password? </span>
          <Link href="/auth/login" className="text-black hover:underline">
            Log in
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>
      </div>
    </div>
  )
} 