"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  function getDestination() {
    const params = new URLSearchParams(window.location.search);
    const requestedPath = params.get("redirect");

    return requestedPath?.startsWith("/") &&
      !requestedPath.startsWith("//") &&
      !requestedPath.includes("\\")
      ? requestedPath
      : "/";
  }

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে");

      router.replace(getDestination());
      router.refresh();
    } catch {
      toast.error("সাইন ইন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(
    provider: "google" | "github"
  ) {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: getDestination(),
        errorCallbackURL: "/signin",
      });

      if (error) {
        toast.error(
          error.message || "সোশ্যাল সাইন ইন করা যায়নি"
        );
      }
    } catch {
      toast.error("সোশ্যাল সাইন ইন করতে সমস্যা হয়েছে");
    } finally {
      setSocialLoading(null);
    }
  }

  const isBusy = loading || socialLoading !== null;

  return (
    <main className="min-h-[70vh] bg-[#F0F6F1] px-4 py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[460px]">
        <div className="rounded-2xl border border-[#E2EAE4] bg-white p-6 shadow-sm sm:p-9">
          {/* Heading */}
          <h1 className="text-center text-3xl font-bold text-[#1E2921]">
            সাইন ইন
          </h1>

          <p className="mt-2 text-center text-sm text-[#758078]">
            আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন
          </p>

          {/* Email and password form */}
          <form
            onSubmit={handleSignIn}
            className="mt-8 flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#1E2921]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full rounded-lg border border-[#DCE5DF] bg-white px-4 py-3 text-[#1E2921] outline-none focus:border-[#008D43]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#1E2921]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                className="w-full rounded-lg border border-[#DCE5DF] bg-white px-4 py-3 text-[#1E2921] outline-none focus:border-[#008D43]"
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full rounded-lg bg-[#008D43] px-5 py-3 font-semibold text-white transition hover:bg-[#007536] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2EAE4]" />

            <span className="text-sm text-[#758078]">
              অথবা
            </span>

            <div className="h-px flex-1 bg-[#E2EAE4]" />
          </div>

          {/* Google and GitHub - horizontal buttons */}
          <div className="grid w-full grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={isBusy}
              className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-[#DCE5DF] bg-white px-2 py-3 text-xs font-semibold text-[#1E2921] transition hover:bg-[#F6FAF7] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.8 7.18l7.73 6C44.38 38.03 46.98 31.88 46.98 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.92 23.92 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              <span className="whitespace-nowrap">
                {socialLoading === "google"
                  ? "সাইন ইন হচ্ছে..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={isBusy}
              className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-[#DCE5DF] bg-white px-2 py-3 text-xs font-semibold text-[#1E2921] transition hover:bg-[#F6FAF7] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="shrink-0"
              >
                <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.924c.562.105.768-.244.768-.542 0-.267-.01-.974-.015-1.912-3.126.679-3.786-1.506-3.786-1.506-.51-1.296-1.246-1.641-1.246-1.641-1.018-.696.077-.681.077-.681 1.126.079 1.718 1.156 1.718 1.156 1 .1.611 2.032 2.7 1.444.1-.724.391-1.218.711-1.498-2.495-.284-5.118-1.248-5.118-5.557 0-1.228.439-2.231 1.158-3.018-.116-.284-.502-1.427.11-2.975 0 0 .944-.302 3.094 1.153a10.77 10.77 0 0 1 5.633 0c2.15-1.455 3.092-1.153 3.092-1.153.614 1.548.228 2.691.112 2.975.721.787 1.156 1.79 1.156 3.018 0 4.32-2.627 5.269-5.13 5.547.402.348.76 1.034.76 2.084 0 1.506-.014 2.721-.014 3.092 0 .3.203.653.773.541A11.25 11.25 0 0 0 12 .75Z" />
              </svg>

              <span className="whitespace-nowrap">
                {socialLoading === "github"
                  ? "সাইন ইন হচ্ছে..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-[#758078]">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#008D43] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        {/* Back to homepage */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#758078] transition hover:text-[#008D43]"
          >
            <span aria-hidden="true">←</span>
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
