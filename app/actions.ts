"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface AuthResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export const signUpAction = async (formData: FormData): Promise<AuthResponse> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      error: error.message,
    };
  }

  return {
    success: true,
    message: "Thanks for signing up! Please check your email for a verification link.",
  };
};

export const signInAction = async (formData: FormData): Promise<AuthResponse> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData): Promise<AuthResponse> => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return {
      error: "Email is required",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/auth/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return {
      error: "Could not reset password",
    };
  }

  return {
    success: true,
    message: "Check your email for a link to reset your password.",
  };
};

export const resetPasswordAction = async (formData: FormData): Promise<AuthResponse> => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return {
      error: "Password and confirm password are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      error: "Password update failed",
    };
  }

  return {
    success: true,
    message: "Password updated successfully. Please log in with your new password.",
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
};
