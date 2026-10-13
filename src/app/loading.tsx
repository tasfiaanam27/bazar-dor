function SkeletonCard() {
  return (
    <div className="min-h-[165px] animate-pulse rounded-2xl border border-[#E2EAE4] bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-[#E8EFE9]" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-[#E8EFE9]" />
          <div className="h-3 w-1/3 rounded bg-[#E8EFE9]" />
        </div>
      </div>

      <div className="mt-7 space-y-3">
        <div className="h-3 w-20 rounded bg-[#E8EFE9]" />

        <div className="flex items-center justify-between gap-4">
          <div className="h-6 w-24 rounded bg-[#E8EFE9]" />
          <div className="h-6 w-16 rounded-full bg-[#E8EFE9]" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F0F6F1] pb-20">
      <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6 lg:pt-8">
        {/* Hero skeleton */}
        <div className="flex min-h-[283px] animate-pulse flex-col justify-between gap-8 rounded-2xl border border-[#E2EAE4] bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:p-10">
          <div className="w-full max-w-[620px] space-y-5">
            <div className="h-7 w-40 rounded-full bg-[#E8EFE9]" />
            <div className="h-10 w-4/5 rounded bg-[#E8EFE9]" />
            <div className="h-4 w-full rounded bg-[#E8EFE9]" />
            <div className="h-4 w-3/4 rounded bg-[#E8EFE9]" />
            <div className="h-11 w-36 rounded-lg bg-[#E8EFE9]" />
          </div>

          <div className="h-44 w-full rounded-xl bg-[#E8EFE9] sm:h-52 lg:w-[280px]" />
        </div>

        {/* Price sections */}
        {["আজ দাম বেড়েছে", "আজ দাম কমেছে", "সব পণ্য"].map(
          (title) => (
            <section key={title} className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-[#1E2921]">
                {title}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </section>
          )
        )}
      </div>
    </main>
  );
}