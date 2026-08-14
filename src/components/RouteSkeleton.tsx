export function RouteSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-600" />
          </div>
          <div className="ml-3 flex shrink-0 gap-2">
            <div className="h-8 w-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  )
}
