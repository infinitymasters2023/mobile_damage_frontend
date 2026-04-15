"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

export function SignupComponent() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  // ✅ EMAIL VALIDATION
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  };

  // ✅ PASSWORD VALIDATION (strong)
  const isStrongPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password
    );
  };

  // ✅ FULL VALIDATION
  const validate = (): boolean => {
    const newErrors: Errors = {};

    // NAME
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]{3,50}$/.test(form.name)) {
      newErrors.name =
        "Name must be 3–50 letters only";
    }

    // EMAIL
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // PASSWORD
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!isStrongPassword(form.password)) {
      newErrors.password =
        "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return; // stop if invalid

    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md p-8 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-10 relative m-4"
    >
      {/* HEADER */}
      <div className="text-center mb-8 mt-2">
        <h2 className="text-3xl font-bold text-white">
          Create Account
        </h2>
        <p className="text-zinc-400">
          Join InfyEazy to start securing data
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSignup} className="space-y-6">

        {/* NAME */}
        <div>
          <label className="text-sm text-zinc-300">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-zinc-300">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white"
            placeholder="name@company.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-zinc-300">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#111] border border-zinc-800 rounded-lg text-white"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-medium transition-all"
        >
          {isLoading ? "Processing..." : "Create Account"}
        </button>
      </form>

      {/* LOGIN LINK */}
      <p className="mt-8 text-center text-zinc-500 text-sm">
        Already have an account?{" "}
        <Link href="/" className="text-blue-500 hover:text-blue-400 font-medium">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}