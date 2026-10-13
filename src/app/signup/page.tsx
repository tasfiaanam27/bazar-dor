"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        return;
      }

      toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
      router.push("/signin");
    } catch {
      toast.error("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F0F6F1] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#E2EAE4] bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-center text-3xl font-bold text-[#1E2921]">
          সাইন আপ
        </h1>

        <p className="mt-2 text-center text-sm text-[#758078]">
          বাজার দর-এ নতুন অ্যাকাউন্ট তৈরি করুন
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block font-medium text-[#1E2921]">
              নাম
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full rounded-xl border border-[#DCE5DF] bg-white px-4 py-3 text-[#1E2921] outline-none focus:border-[#008D43]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-medium text-[#1E2921]">
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full rounded-xl border border-[#DCE5DF] bg-white px-4 py-3 text-[#1E2921] outline-none focus:border-[#008D43]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium text-[#1E2921]">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-xl border border-[#DCE5DF] bg-white px-4 py-3 text-[#1E2921] outline-none focus:border-[#008D43]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#008D43] px-4 py-3 font-semibold text-white transition hover:bg-[#007536] disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "রেজিস্টার করুন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#758078]">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-semibold text-[#008D43] hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}