
import Link from "next/link";
import { House, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F0F6F1] px-4 py-16">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E0F2E7]">
          <SearchX size={48} className="text-[#008D43]" />
        </div>

        <h1 className="text-7xl font-extrabold text-[#008D43]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-[#1E2921]">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h2>

        <p className="mt-4 text-[#647067]">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
          অনুগ্রহ করে হোমপেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#008D43] px-7 py-3 font-semibold text-white transition hover:bg-[#007536]"
        >
          <House size={19} />
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
