"use client";

type Product = {
  id: number;
  nameBn: string;
  image: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type PriceTickerProps = {
  products: Product[];
  isBangla: boolean;
};

export default function PriceTicker({
  products,
  isBangla,
}: PriceTickerProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(isBangla ? "bn-BD" : "en-US").format(value);

  const formatPercent = (value: number) =>
    new Intl.NumberFormat(isBangla ? "bn-BD" : "en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(Math.abs(value));

  const unitBangla: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
  };

  const tickerItems = (copy: number) =>
    products.map((product) => (
      <div
        key={`${copy}-${product.id}`}
        className="flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-gray-200 px-6 py-3"
      >
        <span>{product.image}</span>

        <span className="font-medium">{product.nameBn}</span>

        <span>
          {formatNumber(product.today)}{" "}
          {isBangla ? "টাকা" : "Taka"}/
          {isBangla
            ? unitBangla[product.unit] ?? product.unit
            : product.unit}
        </span>

        <span
          className={`font-semibold ${
            product.change.dir === "up"
              ? "text-red-600"
              : product.change.dir === "down"
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          {product.change.dir === "up"
            ? "▲ "
            : product.change.dir === "down"
            ? "▼ "
            : "— "}
          {formatPercent(product.change.pct)}%
        </span>
      </div>
    ));

  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden border-b border-gray-200 bg-white">
      <div className="flex w-max animate-[ticker_45s_linear_infinite] hover:[animation-play-state:paused]">
        <div className="flex w-max shrink-0">
          {tickerItems(1)}
        </div>

        <div className="flex w-max shrink-0" aria-hidden="true">
          {tickerItems(2)}
        </div>
      </div>
    </div>
  );
}
