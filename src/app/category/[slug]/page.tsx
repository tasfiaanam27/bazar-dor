import { notFound } from "next/navigation";
import CategoryProducts from "../../components/CategoryProducts";

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
  new Intl.NumberFormat("bn-BD").format(value);

async function getData(slug: string) {
  const [categoryResponse, productsResponse] = await Promise.all([
    fetch(`${API}/categories`, { cache: "no-store" }),
    fetch(`${API}/products?category=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    }),
  ]);

  if (!categoryResponse.ok || !productsResponse.ok) {
    throw new Error("Failed to load category data");
  }

  const categoryData = await categoryResponse.json();
  const productData = await productsResponse.json();

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

        {/* Functional sorting and product cards */}
        <CategoryProducts products={products} />
      </div>
    </main>
  );
}