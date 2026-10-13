export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F0F6F1] pb-16">
      <div className="mx-auto max-w-[1152px] px-4 py-6 sm:px-6">
        {/* Category heading skeleton */}
        <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#E2EAE4] bg-white p-5">
          <div className="h-14 w-14 rounded-xl bg-[#E2EAE4]" />
          <div className="space-y-3">
            <div className="h-6 w-28 rounded bg-[#E2EAE4]" />
            <div className="h-4 w-52 rounded bg-[#E2EAE4]" />
          </div>
        </div>

        {/* Sorting skeleton */}
        <div className="mt-6 flex h-[58px] animate-pulse items-center justify-end gap-3 rounded-2xl border border-[#E2EAE4] bg-white px-5">
          <div className="h-4 w-12 rounded bg-[#E2EAE4]" />
          <div className="h-9 w-32 rounded-lg bg-[#E2EAE4]" />
        </div>

        <div className="mt-5 h-4 w-48 animate-pulse rounded bg-[#E2EAE4]" />

        {/* Product cards skeleton */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[155px] animate-pulse rounded-2xl border border-[#E2EAE4] bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#E2EAE4]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-[#E2EAE4]" />
                  <div className="h-3 w-1/3 rounded bg-[#E2EAE4]" />
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <div className="h-3 w-20 rounded bg-[#E2EAE4]" />
                <div className="flex justify-between">
                  <div className="h-6 w-24 rounded bg-[#E2EAE4]" />
                  <div className="h-6 w-16 rounded-full bg-[#E2EAE4]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}