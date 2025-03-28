'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("verified") === "success") {
      setSuccessMessage("Verifikasi email berhasil! Silakan login.");

      setTimeout(() => {
        router.replace("/login");
      }, 10000);
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      const errorMsg = res?.error || "Terjadi kesalahan saat login.";
      setError(errorMsg);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
        Masuk ke akun Anda
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* ✅ Notifikasi sukses */}
        {successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}

        {/* ❌ Notifikasi error */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Belum punya akun?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Daftar sekarang
        </a>
      </p>
    </div>
  );
}