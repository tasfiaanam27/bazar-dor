"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session?.user, router]);

  async function handleSignOut() {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#F0F6F1]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#008D43] border-t-transparent" />
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-[75vh] bg-[#F0F6F1] px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-[650px]">
        <h1 className="text-3xl font-bold text-[#1E2921]">
          আমার প্রোফাইল
        </h1>

        <p className="mt-2 text-sm text-[#758078]">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        {/* Profile Card */}
        <section className="mt-7 flex flex-col gap-4 rounded-2xl border border-[#E2EAE4] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EAF5EE] text-2xl font-bold text-[#008D43]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-[#1E2921]">
                {user.name}
              </h2>
              <p className="break-all text-sm text-[#758078]">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut size={15} />
            {loggingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
          </button>
        </section>

        {/* Information Card */}
        <section className="mt-5 rounded-2xl border border-[#E2EAE4] bg-white p-6">
          <h3 className="mb-7 text-lg font-bold text-[#1E2921]">
            তথ্য
          </h3>

          <p className="mb-2 text-sm font-medium text-[#1E2921]">
            নাম
          </p>

          <div className="rounded-lg border border-[#E2EAE4] bg-[#FAFCFA] px-4 py-3 font-medium text-[#1E2921]">
            {user.name}
          </div>

          <Link
            href="/profile/update"
            className="mt-5 block rounded-lg bg-[#008D43] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#007536]"
          >
            আপডেট
          </Link>
        </section>
      </div>
    </main>
  );
}
