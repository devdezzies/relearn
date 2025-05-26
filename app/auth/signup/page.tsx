"use client";

import { signUpAction } from "@/app/actions"
import { FormMessage } from "@/components/form-message"
import { SmtpMessage } from "@/components/smtp-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
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
      {pending ? "Creating account..." : "Continue"}
    </Button>
  );
}

export default function SignUpPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = (formData: FormData) => {
    let isValid = true;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Reset errors
    setEmailError("");
    setPasswordError("");
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

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (validateForm(formData)) {
      const result = await signUpAction(formData);
      if (result.error) {
        setServerError(
          result.error.includes("already registered")
            ? "This email is already registered. Please try logging in instead."
            : result.error
        );
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
          <h1 className="text-4xl font-serif mb-8">Create an account</h1>
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
          
          <div className="space-y-2">
            <PasswordInput
              name="password"
              placeholder="Password"
              required
              className="w-full"
              error={passwordError}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long and contain at least one uppercase letter, 
              one lowercase letter, and one number.
            </p>
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
          <span className="text-gray-600">Already have an account? </span>
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

        <SmtpMessage />
      </div>
    </div>
  )
} 