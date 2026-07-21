type AttractionCardProps = {
  name: string
  image?: string
  selected?: boolean
}

export function AttractionCard({ name, image, selected = false }: AttractionCardProps) {
  return (
    <div
      className={`flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border-2 transition sm:w-48 lg:w-56 ${
        selected
          ? 'border-pink shadow-lg shadow-pink/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex h-28 items-center justify-center bg-slate-100 sm:h-36">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <svg className="h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
        )}
      </div>
      <div className="p-3">
        <p className={`text-sm font-semibold ${selected ? 'text-pink' : 'text-navy'}`}>{name}</p>
      </div>
    </div>
  )
}
