"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  UserRound,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryIcon: string;
  unit: string;
  today: number;
  change: {
    dir: string;
    pct: number;
  };
};

const API = "https://openapi.programming-hero.com/api/bazardor";

const englishCategories: Record<string, string> = {
  chal: "Rice",
  dal: "Pulses",
  tel: "Oil",
  sobji: "Vegetables",
  mach: "Fish",
  mangsho: "Meat",
  "dim-dui": "Egg & Milk",
  mosla: "Spices",
};

const unitBn: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

const productEnglish: Record<string, string> = {
  "sorno-machi-chal": "Swarnamachi Rice",
  "miniket-chal": "Miniket Rice",
  "nazir-chal": "Nazir Rice",
  "batam-size-chal": "Batam Size Rice",
};

function formatNumber(n: number, bn: boolean) {
  return new Intl.NumberFormat(bn ? "bn-BD" : "en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(n);
}

function getEnglishName(product: Product) {
  if (productEnglish[product.slug]) {
    return productEnglish[product.slug];
  }

  return product.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isBangla, setIsBangla] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/products`),
        ]);

        if (!categoryRes.ok || !productRes.ok) {
          throw new Error("Failed to load market data");
        }

        const categoryData = await categoryRes.json();
        const productData = await productRes.json();

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.data ?? []
        );

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.data ?? []
        );
      } catch (error) {
        console.error("Navbar API error:", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      setAccountOpen(false);
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    } finally {
      setLoggingOut(false);
    }
  }

  const date = new Date().toLocaleDateString(
    isBangla ? "bn-BD" : "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }
  );

  const tickerProducts = [...products, ...products];

  function isCategoryActive(slug: string) {
    const href = `/category/${slug}`;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const accountDropdown = (
    <div className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-xl border border-[#E2EAE4] bg-white p-3 shadow-xl">
      {isPending ? (
        <p className="px-2 py-3 text-sm text-gray-500">
          লোড হচ্ছে...
        </p>
      ) : session?.user ? (
        <>
          <div className="border-b border-[#E2EAE4] px-2 pb-3">
            <p className="truncate text-sm font-bold text-[#1E2921]">
              {session.user.name}
            </p>
            <p className="mt-1 truncate text-xs text-[#758078]">
              {session.user.email}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setAccountOpen(false)}
            className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#1E2921] hover:bg-[#F0F6F1]"
          >
            <User size={16} />
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut size={16} />
            {loggingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
          </button>
        </>
      ) : (
        <>
          <Link
            href="/signin"
            onClick={() => setAccountOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[#1E2921] hover:bg-[#F0F6F1]"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            onClick={() => setAccountOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-[#1E2921] hover:bg-[#F0F6F1]"
          >
            সাইন আপ
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="w-full bg-[#F8FBF9]">
      {/* Main Navbar */}
      <div className="border-b border-gray-200">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#008D43] text-2xl sm:h-14 sm:w-14">
              🛒
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight text-[#1E2921] sm:text-2xl lg:text-3xl">
                {isBangla ? "বাজার দর" : "Market Price"}
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {date}
              </p>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-5 md:flex">
            <button
              type="button"
              onClick={() => setIsBangla(!isBangla)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#1E2921]"
            >
              {isBangla ? "English" : "বাংলা"}
            </button>

            {isPending ? (
              <div className="h-11 w-36 animate-pulse rounded-xl bg-gray-200" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-expanded={accountOpen}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 text-[#1E2921] hover:bg-[#EDF5EF]"
                >
                  <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E9] text-[#008D43]">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={21} />
                    )}
                  </span>

                  <span className="max-w-[160px] truncate text-sm font-medium">
                    {session.user.name}
                  </span>

                  <ChevronDown size={15} />
                </button>

                {accountOpen && accountDropdown}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="font-medium text-[#1E2921] hover:text-[#008D43]"
                >
                  {isBangla ? "সাইন ইন" : "Sign in"}
                </Link>

                <Link
                  href="/signup"
                  className="rounded-xl bg-[#008D43] px-6 py-3 font-semibold text-white hover:bg-[#007536]"
                >
                  {isBangla ? "সাইন আপ" : "Sign up"}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsBangla(!isBangla)}
              className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-[#1E2921]"
            >
              {isBangla ? "EN" : "বাং"}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-label="Account"
                aria-expanded={accountOpen}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-gray-200 text-[#1E2921]"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={21} />
                )}
              </button>

              {accountOpen && accountDropdown}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle categories"
              aria-expanded={menuOpen}
              className="rounded-lg border border-gray-200 p-2 text-[#1E2921]"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Categories */}
      <nav className="hidden border-b border-gray-200 md:block">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-7 gap-y-3 px-6 py-4">
          {categories.map((category) => {
            const active = isCategoryActive(category.slug);

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-1 font-medium transition-colors ${
                  active
                    ? "bg-[#008D43] text-white"
                    : "text-[#1E2921] hover:text-[#008D43]"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>
                  {isBangla
                    ? category.nameBn
                    : englishCategories[category.slug] ?? category.slug}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Category Menu */}
      {menuOpen && (
        <nav className="border-b border-gray-200 bg-white md:hidden">
          <div className="grid grid-cols-2 gap-2 p-4">
            {categories.map((category) => {
              const active = isCategoryActive(category.slug);

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#008D43] text-white"
                      : "bg-[#F0F6F1] text-[#1E2921]"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>
                    {isBangla
                      ? category.nameBn
                      : englishCategories[category.slug] ?? category.slug}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Continuous Horizontal Price Ticker — unchanged */}
      <div className="w-full overflow-hidden border-b border-gray-200 bg-white">
        <div className="bazar-ticker-track flex w-max flex-nowrap hover:[animation-play-state:paused]">
          {tickerProducts.map((product, index) => {
            const direction = product.change?.dir ?? "flat";
            const percent = Math.abs(product.change?.pct ?? 0);

            return (
              <div
                key={`${product.id}-${index}`}
                className="flex h-14 shrink-0 items-center gap-2 whitespace-nowrap border-r border-gray-200 px-5 text-sm sm:text-base"
              >
                <span className="text-xl">{product.categoryIcon}</span>

                <span className="font-medium">
                  {isBangla
                    ? product.nameBn
                    : getEnglishName(product)}
                </span>

                <span>
                  {formatNumber(product.today, isBangla)}{" "}
                  {isBangla ? "টাকা" : "taka"}/
                  {isBangla
                    ? unitBn[product.unit] ?? product.unit
                    : product.unit}
                </span>

                <span
                  className={`font-semibold ${
                    direction === "up"
                      ? "text-red-600"
                      : direction === "down"
                        ? "text-green-600"
                        : "text-gray-500"
                  }`}
                >
                  {direction === "up"
                    ? "▲"
                    : direction === "down"
                      ? "▼"
                      : "—"}{" "}
                  {formatNumber(percent, isBangla)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
