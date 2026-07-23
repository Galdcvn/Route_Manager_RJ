import { useTranslation } from 'react-i18next'
import type { Attraction } from '../types/attraction'

type AttractionInfoModalProps = {
  open: boolean
  onClose: () => void
  attraction: Attraction | null
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

export function AttractionInfoModal({ open, onClose, attraction }: AttractionInfoModalProps) {
  const { t } = useTranslation()
  if (!open || !attraction) return null

  const endereco = [attraction.rua, attraction.bairro, attraction.cidade]
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryEmoji[attraction.categoria] ?? '📍'}</span>
              <div>
                <h2 className="text-lg font-bold text-navy">{attraction.nome}</h2>
                <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500">
                  {t('categories.' + (attraction.categoria ?? 'outro'))}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Imagem */}
          {attraction.imagem_url && (
            <div className="mb-4 overflow-hidden rounded-xl">
              <img
                src={attraction.imagem_url}
                alt={attraction.nome}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {/* Endereço */}
          {endereco && (
            <div className="mb-3 flex items-start gap-2 text-sm text-slate-600">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <circle cx="12" cy="11" r="3" />
              </svg>
              <span>{endereco}</span>
            </div>
          )}

          {/* Horários */}
          {attraction.horarios && (
            <div className="mb-3 flex items-start gap-2 text-sm text-slate-600">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{attraction.horarios}</span>
            </div>
          )}

          {/* Descrição */}
          {attraction.descricao && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-600">{attraction.descricao}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
