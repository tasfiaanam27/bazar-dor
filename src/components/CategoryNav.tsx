"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const englishNames: Record<string, string> = {
  chal: "Rice",
  dal: "Lentils",
  tel: "Oil",
  sobji: "Vegetables",
  mach: "Fish",
  mangsho: "Meat",
  "dim-dui": "Eggs & Milk",
  mosla: "Spices",
};

export default function CategoryNav({
  categories,
  isBangla = true,
}: {
  categories: Category[];
  isBangla?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex w-full max-w-[1200px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
      {categories.map((category) => {
        const href = `/category/${category.slug}`;

        const isActive =
          pathname === href ||
          pathname.startsWith(`${href}/`);

        return (
          <Link
            key={category.id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#E5F5EC] text-[#008D43]"
                : "text-[#1E2921] hover:bg-[#F0F6F1] hover:text-[#008D43]"
            }`}
          >
            <span>{category.icon}</span>

            <span>
              {isBangla
                ? category.nameBn
                : englishNames[category.slug] ?? category.slug}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}