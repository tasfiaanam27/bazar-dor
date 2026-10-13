import Link from "next/link";
import { notFound } from "next/navigation";

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

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const API = "https://openapi.programming-hero.com/api/bazardor";

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

async function getData(slug: string) {
  try {
    const [categoryRes, productsRes] = await Promise.all([
      fetch(`${API}/categories`, { cache: "no-store" }),
      fetch(`${API}/products?category=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      }),
    ]);

    if (!categoryRes.ok || !productsRes.ok) {
      throw new Error("Failed to fetch category data");
    }

    const categoryData = await categoryRes.json();
    const productData = await productsRes.json();

    const categories: Category[] = Array.isArray(categoryData)
      ? categoryData
      : categoryData.data ?? [];

    const products: Product[] = Array.isArray(productData)
      ? productData
      : productData.data ?? [];

    return {
      category: categories.find((item) => item.slug === slug),
      products: products.filter((item) => item.category === slug),
    };
  } catch (error) {
    console.error("Category fetch error:", error);
    return { category: undefined, products: [] };
  }
}

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, products } = await getData(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F0F6F1] pb-16">
      <div className="mx-auto max-w-[1152px] px-4 py-6 sm:px-6">
        {/* Category heading */}
        <section className="flex items-center gap-4 rounded-2xl border border-[#E2EAE4] bg-white p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F1] text-3xl">
            {category.icon}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#1E2921]">
              {category.nameBn}
            </h1>
            <p className="mt-1 text-sm text-[#758078]">
              {bnNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Sort bar */}
        <div className="mt-6 flex min-h-[58px] items-center justify-end rounded-2xl border border-[#E2EAE4] bg-white px-5">
          <span className="mr-3 text-sm text-[#758078]">
            সাজান
          </span>

          <select
            defaultValue="default"
            aria-label="পণ্য সাজান"
            className="rounded-lg border border-[#E2EAE4] bg-white px-3 py-2 text-sm font-medium text-[#1E2921]"
          >
            <option value="default">ডিফল্ট</option>
          </select>
        </div>

        {/* Product count */}
        <p className="mb-4 mt-5 text-sm text-[#758078]">
          মোট {bnNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Product grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E2EAE4] bg-white p-8 text-center text-[#758078]">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </main>
  );
}