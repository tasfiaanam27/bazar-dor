import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: string;
    pct: number;
  };
};

const API =
  "https://openapi.programming-hero.com/api/bazardor/products";

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

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    return Array.isArray(data) ? data : data.data ?? [];
  } catch (error) {
    console.error("Product fetch error:", error);
    return [];
  }
}

function PriceCard({ product }: { product: Product }) {
  const direction = product.change?.dir ?? "flat";
  const percent = Math.abs(product.change?.pct ?? 0);

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex min-h-[165px] flex-col justify-between rounded-2xl border border-[#E2EAE4] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#008D43] hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F1] text-[26px] leading-none">
          <span role="img" aria-label={product.nameBn}>
            {product.image || product.categoryIcon}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-[#1E2921]">
            {product.nameBn}
          </h3>
          <p className="text-xs text-gray-500">
            প্রতি {units[product.unit] ?? product.unit}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500">আজকের দাম</p>

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
                : "text-gray-500"
            }`}
          >
            {direction === "up"
              ? "▲"
              : direction === "down"
              ? "▼"
              : "—"}{" "}
            {bnNumber(percent)}%
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  products,
  type,
}: {
  title: string;
  products: Product[];
  type: "up" | "down";
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`text-lg font-bold ${
            type === "up" ? "text-red-600" : "text-green-600"
          }`}
        >
          {type === "up" ? "▲" : "▼"}
        </span>

        <h2 className="text-xl font-bold text-[#1E2921]">
          {title}
        </h2>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl bg-white p-5 text-gray-500">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <PriceCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  const increased = products
    .filter((p) => p.change?.dir === "up")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  const decreased = products
    .filter((p) => p.change?.dir === "down")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return (
    <main className="min-h-screen bg-[#F0F6F1] pb-20">
      <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6 lg:pt-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-[#E2EAE4] bg-white p-5 sm:p-8 lg:min-h-[283px] lg:flex-row lg:p-10">
          <div className="w-full flex-1">
            <span className="inline-block rounded-full bg-[#E5F5EC] px-3 py-1 text-xs font-medium text-[#008D43]">
              {today}
            </span>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#1E2921] sm:text-4xl lg:text-[36px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-[580px] text-sm leading-7 text-gray-600 sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক
              এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <Link
              href="#all-products"
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#008D43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#007536]"
            >
              সব পণ্য দেখুন
            </Link>
          </div>

          <div className="flex w-full shrink-0 items-center justify-center lg:w-[280px]">
            <svg
              viewBox="0 0 280 230"
              className="h-[180px] w-[220px] sm:h-[220px] sm:w-[280px]"
              role="img"
              aria-label="Basket of fresh fruits"
            >
              <ellipse cx="140" cy="212" rx="105" ry="12" fill="#E5E9E5" />
              <path d="M75 130 C62 91 87 65 109 83 C129 98 126 123 114 140Z" fill="#F43F5E" />
              <path d="M93 87 Q94 67 113 65" fill="none" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="90" cy="105" rx="9" ry="15" fill="#FB7185" />
              <path d="M119 126 C103 74 126 39 153 54 C184 72 174 114 163 139Z" fill="#22C55E" />
              <path d="M144 58 Q141 38 128 34 M144 58 Q148 34 163 29" fill="none" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="136" cy="84" rx="9" ry="16" fill="#86EFAC" />
              <circle cx="69" cy="139" r="21" fill="#A855F7" />
              <circle cx="104" cy="130" r="20" fill="#F97316" />
              <circle cx="155" cy="138" r="21" fill="#F59E0B" />
              <path d="M154 116 Q158 100 170 100" fill="none" stroke="#15803D" strokeWidth="3" />
              <path d="M48 145 L230 145 L208 203 Q140 217 70 203Z" fill="#B45309" />
              <path d="M48 145 L230 145 L225 157 L53 157Z" fill="#92400E" />
              <path d="M88 160 L96 199 M120 160 L123 205 M158 160 L157 205 M194 160 L185 199" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        <ProductSection
          title="আজ দাম বেড়েছে"
          products={increased}
          type="up"
        />

        <ProductSection
          title="আজ দাম কমেছে"
          products={decreased}
          type="down"
        />

        {/* All Products */}
        <section id="all-products" className="mt-12 scroll-mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#1E2921]">
              সব পণ্য
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              মোট {bnNumber(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>

          {products.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-gray-500">
              পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <PriceCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
