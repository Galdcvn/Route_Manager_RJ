type AttractionCardProps = {
  name: string
  category?: string
  image?: string
  selected?: boolean
  bairro?: string
  onClick?: () => void
}

const categoryEmoji: Record<string, string> = {
  monumento: '🗿',
  praia: '🏖️',
  museu: '🏛️',
  mirante: '🏔️',
  parque: '🌳',
  mercado: '🏪',
  igreja: '⛪',
  restaurante: '🍽️',
  outro: '📍',
}

export function AttractionCard({
  name,
  category,
  image,
  selected = false,
  bairro,
  onClick,
}: AttractionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border-2 text-left transition sm:w-48 lg:w-56 ${
        selected
          ? 'border-pink shadow-lg shadow-pink/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex h-28 items-center justify-center bg-slate-100 sm:h-36">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl">{categoryEmoji[category ?? 'outro'] ?? '📍'}</span>
        )}
      </div>
      <div className="p-3">
        {category && (
          <span className="mb-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-500">
            {category}
          </span>
        )}
        <p className={`text-sm font-semibold ${selected ? 'text-pink' : 'text-navy'}`}>
          {name}
        </p>
        {bairro && (
          <p className="mt-0.5 text-xs text-slate-400">{bairro}</p>
        )}
      </div>
    </button>
  )
}
