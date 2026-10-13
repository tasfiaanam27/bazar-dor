import Link from "next/link";

import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type Market = Record<string, unknown>;

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

  lastWeek?: number;

  lastMonth?: number;

  change: {

    dir: "up" | "down" | "flat";

    pct: number;

  };

  markets?: Market[];

};

const API = "https://openapi.programming-hero.com/api/bazardor";

const bn = (value: number) =>

  new Intl.NumberFormat("bn-BD", {

    maximumFractionDigits: 2,

  }).format(value);

const units: Record<string, string> = {

  kg: "কেজি",

  litre: "লিটার",

  liter: "লিটার",

  dozen: "ডজন",

  piece: "পিস",

  pcs: "পিস",

};

function readText(

  item: Market,

  keys: string[],

  fallback = "—"

): string {

  for (const key of keys) {

    const value = item[key];

    if (

      typeof value === "string" ||

      typeof value === "number"

    ) {

      return String(value);

    }

  }

  return fallback;

}

function readNumber(

  item: Market,

  keys: string[]

): number | null {

  for (const key of keys) {

    const value = item[key];

    if (

      typeof value === "number" &&

      Number.isFinite(value)

    ) {

      return value;

    }

    if (

      typeof value === "string" &&

      value.trim() !== "" &&

      Number.isFinite(Number(value))

    ) {

      return Number(value);

    }

  }

  return null;

}

function price(value: number | null) {

  return value === null ? "—" : `${bn(value)} টাকা`;

}

async function getProduct(

  id: string

): Promise<Product | null> {

  try {

    const response = await fetch(

      `${API}/products/${encodeURIComponent(id)}`,

      { cache: "no-store" }

    );

    if (!response.ok) return null;

    const result = await response.json();

    const product = result?.data ?? result;

    if (

      !product ||

      typeof product !== "object" ||

      typeof product.id !== "number"

    ) {

      return null;

    }

    return product as Product;

  } catch (error) {

    console.error("Product details API error:", error);

    return null;

  }

}

export default async function ProductDetailsPage({

  params,

}: {

  params: Promise<{ id: string }>;

}) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { id } = await params;

  if (!session?.user) {
    redirect(`/signin?redirect=${encodeURIComponent(`/products/${id}`)}`);
  }

  const product = await getProduct(id);

  if (!product) notFound();

  const markets = Array.isArray(product.markets)

    ? product.markets

    : [];

  const marketPrices = markets.map((market) => {

    const minimum = readNumber(market, [

      "min",

      "minPrice",

      "minimum",

      "lowest",

      "low",

    ]);

    const maximum = readNumber(market, [

      "max",

      "maxPrice",

      "maximum",

      "highest",

      "high",

    ]);

    const apiAverage = readNumber(market, [

      "avg",

      "avgPrice",

      "average",

      "averagePrice",

      "price",

    ]);

    const average =

      apiAverage !== null

        ? apiAverage

        : minimum !== null && maximum !== null

        ? (minimum + maximum) / 2

        : null;

    return {

      market,

      minimum,

      maximum,

      average,

    };

  });

  const minimumValues = marketPrices

    .map((item) => item.minimum)

    .filter((value): value is number => value !== null);

  const maximumValues = marketPrices

    .map((item) => item.maximum)

    .filter((value): value is number => value !== null);

  const averageValues = marketPrices

    .map((item) => item.average)

    .filter((value): value is number => value !== null);

  const lowest =

    minimumValues.length > 0

      ? Math.min(...minimumValues)

      : null;

  const highest =

    maximumValues.length > 0

      ? Math.max(...maximumValues)

      : null;

  const average =

    averageValues.length > 0

      ? averageValues.reduce(

          (sum, value) => sum + value,

          0

        ) / averageValues.length

      : null;

  const direction = product.change?.dir ?? "flat";

  const difference = product.today - product.yesterday;

  const unit = units[product.unit] ?? product.unit;

  return (

    <main className="min-h-screen bg-[#F0F6F1] pb-16">

      <div className="mx-auto w-full max-w-[1200px] px-4 py-7 sm:px-6 lg:py-9">

        {/* Breadcrumb */}

        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#647067]">

          <Link href="/" className="hover:text-[#008D43]">

            হোম

          </Link>

          <span>›</span>

          <Link

            href={`/category/${product.category}`}

            className="hover:text-[#008D43]"

          >

            {product.categoryNameBn}

          </Link>

          <span>›</span>

          <span className="font-medium text-[#1E2921]">

            {product.nameBn}

          </span>

        </nav>

        {/* Product Header */}

        <section className="flex flex-col gap-5 rounded-2xl border border-[#E2EAE4] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div className="flex min-w-0 items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0F6F1] text-4xl sm:h-20 sm:w-20">

              {product.image || product.categoryIcon}

            </div>

            <div className="min-w-0">

              <h1 className="text-2xl font-bold text-[#1E2921] sm:text-3xl">

                {product.nameBn}

              </h1>

              <p className="mt-1 text-sm text-[#66736B]">

                প্রতি {unit} · {product.categoryNameBn}

              </p>

              <p className="mt-2 text-sm text-[#536058]">

                গতকালের তুলনায় আজ দাম{" "}

                {direction === "up"

                  ? "বেড়েছে"

                  : direction === "down"

                  ? "কমেছে"

                  : "অপরিবর্তিত রয়েছে"}

                {direction !== "flat" && (

                  <> · {bn(Math.abs(difference))} টাকা</>

                )}

              </p>

            </div>

          </div>

          <div className="w-full shrink-0 rounded-2xl bg-[#F0F6F1] px-6 py-4 text-center sm:w-auto sm:min-w-[135px]">

            <p className="text-xs text-[#647067]">

              আজকের দাম

            </p>

            <p className="mt-1 text-3xl font-bold text-[#1E2921]">

              {bn(product.today)}

            </p>

            <p className="text-xs text-[#647067]">

              টাকা / {unit}

            </p>

            <p

              className={`mt-2 text-sm font-semibold ${

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

              {bn(Math.abs(product.change?.pct ?? 0))}%

            </p>

          </div>

        </section>

        {/* Price Summary and Market Table */}

        <section className="mt-6 rounded-2xl border border-[#E2EAE4] bg-white p-4 sm:p-6">

          <h2 className="text-xl font-bold text-[#1E2921]">

            দামের সারসংক্ষেপ

          </h2>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div className="rounded-xl border border-[#E2EAE4] p-4">

              <p className="text-sm text-[#647067]">

                সর্বনিম্ন দাম

              </p>

              <p className="mt-2 text-2xl font-bold text-[#008D43]">

                {price(lowest)}

              </p>

              <p className="mt-1 text-xs text-[#647067]">

                সবচেয়ে কম দামের বাজার

              </p>

            </div>

            <div className="rounded-xl border border-[#E2EAE4] p-4">

              <p className="text-sm text-[#647067]">

                সর্বাধিক দাম

              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">

                {price(highest)}

              </p>

              <p className="mt-1 text-xs text-[#647067]">

                সবচেয়ে বেশি দামের বাজার

              </p>

            </div>

            <div className="rounded-xl border border-[#E2EAE4] p-4">

              <p className="text-sm text-[#647067]">

                গড় দাম

              </p>

              <p className="mt-2 text-2xl font-bold text-[#008D43]">

                {price(average)}

              </p>

              <p className="mt-1 text-xs text-[#647067]">

                প্রতি {unit}-এর হিসাবে

              </p>

            </div>

          </div>

          <h2 className="mb-4 mt-8 text-xl font-bold text-[#1E2921]">

            বাজারভিত্তিক আজকের দাম

          </h2>

          {marketPrices.length === 0 ? (

            <p className="rounded-xl bg-[#F0F6F1] p-5 text-sm text-gray-500">

              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।

            </p>

          ) : (

            <div className="overflow-x-auto rounded-xl border border-[#E2EAE4]">

              <table className="w-full min-w-[650px] border-collapse text-left text-sm">

                <thead className="bg-[#F8FAF8] text-[#647067]">

                  <tr>

                    <th className="px-4 py-4 font-semibold">

                      বাজার

                    </th>

                    <th className="px-4 py-4 font-semibold">

                      বিভাগ

                    </th>

                    <th className="px-4 py-4 text-right font-semibold">

                      সর্বনিম্ন

                    </th>

                    <th className="px-4 py-4 text-right font-semibold">

                      সর্বাধিক

                    </th>

                    <th className="px-4 py-4 text-right font-semibold">

                      গড়

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {marketPrices.map((item, index) => (

                    <tr

                      key={index}

                      className={`border-t border-[#354139] ${

                        index % 2 === 0

                          ? "bg-white"

                          : "bg-[#F0F6F1]"

                      }`}

                    >

                      <td className="px-4 py-4 font-medium text-[#1E2921]">

                        {readText(item.market, [

                          "marketNameBn",

                          "nameBn",

                          "marketName",

                          "market",

                          "name",

                        ])}

                      </td>

                      <td className="px-4 py-4 text-[#536058]">

                        {readText(item.market, [

                          "divisionBn",

                          "districtBn",

                          "division",

                          "district",

                          "location",

                        ])}

                      </td>

                      <td className="px-4 py-4 text-right">

                        {price(item.minimum)}

                      </td>

                      <td className="px-4 py-4 text-right">

                        {price(item.maximum)}

                      </td>

                      <td className="px-4 py-4 text-right font-semibold text-[#1E2921]">

                        {price(item.average)}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </main>

  );

}