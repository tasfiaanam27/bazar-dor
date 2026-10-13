"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();

  const { data: session, isPending, refetch } =
    authClient.useSession();

  const [name, setName] = useState("");
  const [initializedUserId, setInitializedUserId] =
    useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session?.user, router]);

  useEffect(() => {
    if (
      session?.user &&
      initializedUserId !== session.user.id
    ) {
      setName(session.user.name || "");
      setInitializedUserId(session.user.id);
    }
  }, [session?.user, initializedUserId]);

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (updatedName === session?.user?.name) {
      toast("নাম পরিবর্তন করা হয়নি");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      await refetch();

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");

      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#F0F6F1]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#008D43] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-[#F0F6F1] px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-[650px]">
        <h1 className="text-3xl font-bold text-[#1E2921]">
          তথ্য আপডেট
        </h1>

        <p className="mt-2 text-sm text-[#758078]">
          আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।
        </p>

        <section className="mt-7 rounded-2xl border border-[#E2EAE4] bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-lg font-bold text-[#1E2921]">
            তথ্য
          </h2>

          <form onSubmit={handleUpdate}>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#1E2921]"
            >
              নাম
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="আপনার নাম লিখুন"
              className="relative z-50 w-full rounded-lg border border-[#DCE5DF] bg-white px-4 py-3 text-[#1E2921] outline-none focus:border-[#008D43]"
            />

            <button
              type="submit"
              disabled={saving}
              className="mt-5 w-full rounded-lg bg-[#008D43] px-5 py-3 font-semibold text-white transition hover:bg-[#007536] disabled:opacity-60"
            >
              {saving
                ? "আপডেট হচ্ছে..."
                : "তথ্য আপডেট করুন"}
            </button>
          </form>

          <Link
            href="/profile"
            className="mt-5 block text-center text-sm font-medium text-[#758078] hover:text-[#008D43]"
          >
            প্রোফাইলে ফিরে যান
          </Link>
        </section>
      </div>
    </main>
  );
}

