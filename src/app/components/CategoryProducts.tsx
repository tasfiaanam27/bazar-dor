"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  nameBn: string;
  category: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type SortOption = "default" | "low" | "high";

const bnNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);

const units: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

function ProductCard({ product }: { product: Product }) {
  const direction = product.change?.dir ?? "flat";
  const percentage = Math.abs(product.change?.pct ?? 0);

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex min-h-[155px] flex-col justify-between rounded-2xl border border-[#E2EAE4] bg-white p-4 transition hover:border-[#008D43] hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F1] text-2xl">
          {product.image || product.categoryIcon}
        </div>

        <div className="min-w-0">
          <h3 className="text-[16px] font-bold leading-snug text-[#1E2921]">
            {product.nameBn}
          </h3>

          <p className="mt-1 text-xs text-[#758078]">
            প্রতি {units[product.unit] ?? product.unit}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-[#758078]">আজকের দাম</p>

        <div className="mt-1 flex items-end justify-between gap-2">
          <p className="text-xl font-bold text-[#1E2921]">
            {bnNumber(product.today)}{" "}
            <span className="text-sm font-medium">টাকা</span>
          </p>

          <span
            className={`rounded-full bg-[#F0F6F1] px-2 py-1 text-xs font-semibold ${
              direction === "up"
                ? "text-red-600"
                : direction === "down"
                  ? "text-green-600"
                  : "text-[#66716B]"
            }`}
          >
            {direction === "up"
              ? "▲"
              : direction === "down"
                ? "▼"
                : "—"}{" "}
            {bnNumber(percentage)}%
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.today - b.today);
    }

    if (sort === "high") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  return (
    <>
      {/* Sort control */}
      <div className="mt-6 flex min-h-[58px] items-center justify-end rounded-2xl border border-[#E2EAE4] bg-white px-5">
        <label
          htmlFor="category-sort"
          className="mr-3 text-sm text-[#758078]"
        >
          সাজান
        </label>

        <select
          id="category-sort"
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as SortOption)
          }
          className="cursor-pointer rounded-lg border border-[#E2EAE4] bg-white px-3 py-2 text-sm font-medium text-[#1E2921] outline-none focus:border-[#008D43]"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      {/* Product count */}
      <p className="mb-4 mt-5 text-sm text-[#758078]">
        মোট {bnNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {/* Products */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E2EAE4] bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-[#1E2921]">
            কোনো পণ্য পাওয়া যায়নি
          </h2>

          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-[#008D43] px-5 py-3 text-sm font-semibold text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </>
  );
}