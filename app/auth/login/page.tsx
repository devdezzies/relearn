"use client";

import { signInAction } from "@/app/actions"
import { FormMessage } from "@/components/form-message"
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
      {pending ? "Signing in..." : "Continue"}
    </Button>
  );
}

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
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
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (validateForm(formData)) {
      const result = await signInAction(formData);
      if ('error' in result) {
        setServerError(
          result.error === "Invalid login credentials"
            ? "The email or password you entered is incorrect. Please try again."
            : result.error
        );
      }
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-8">Log in</h1>
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
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Password</span>
              <Link href="/auth/forgot-password" className="text-sm text-black hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              name="password"
              placeholder="Password"
              required
              className="w-full"
              error={passwordError}
            />
          </div>

          <SubmitButton />
          
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/auth/signup" className="text-black hover:underline">
            Sign up
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